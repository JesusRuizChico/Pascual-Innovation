// backend-selectia/src/controllers/applicationController.js
const Application = require('../models/Application');
const Candidate = require('../models/Candidate');
const Vacancy = require('../models/Vacancy');
const Notification = require('../models/Notification');

// --- 1. APPLY TO A VACANCY (WITH MATCHING ALGORITHM) ---
exports.applyToVacancy = async (req, res) => {
    try {
        const { vacancyId } = req.body;
        const userId = req.user.id;

        // 1. Get Candidate and Skills
        const candidateProfile = await Candidate.findOne({ user: userId });
        if (!candidateProfile) {
            return res.status(400).json({ msg: 'You must complete your profile (CV) before applying.' });
        }

        // 2. Get Vacancy and Required Skills
        const vacancy = await Vacancy.findById(vacancyId);
        if (!vacancy) {
            return res.status(404).json({ msg: 'Vacancy not found' });
        }

        // 3. Verify if already applied
        const existingApp = await Application.findOne({ 
            vacancy: vacancyId, 
            candidate: candidateProfile._id 
        });
        if (existingApp) {
            return res.status(400).json({ msg: 'You have already applied to this vacancy.' });
        }

        // --- 🧠 AI MATCHING ALGORITHM (SelectIA Logic) ---
        let matchScore = 0;
        
        // A. Normalize texts
        const candidateSkills = candidateProfile.skills.map(s => s.toLowerCase().trim());
        const requiredSkills = vacancy.skills_required.map(s => s.toLowerCase().trim());

        // B. Calculate score
        if (requiredSkills.length === 0) {
            matchScore = 70; // Neutral default score
        } else {
            // C. Count matches
            const matches = requiredSkills.filter(reqSkill => 
                candidateSkills.includes(reqSkill)
            );

            // D. Calculate percentage
            const calculatedPercentage = (matches.length / requiredSkills.length) * 100;
            matchScore = Math.round(calculatedPercentage);
        }

        // Bonus: Experience adjustment
        if (candidateProfile.experience_years > 2) {
            matchScore = Math.min(matchScore + 5, 100);
        }

        // 4. Create Application
        const newApplication = new Application({
            vacancy: vacancyId,
            candidate: candidateProfile._id,
            ai_score: matchScore,
            status: 'nuevo'
        });

        await newApplication.save();

        // --- 5. NOTIFY RECRUITER ---
        await Notification.create({
            user: vacancy.created_by, // Notify the recruiter who created the vacancy
            title: 'New Candidate 🚀',
            message: `${candidateProfile.full_name} applied for "${vacancy.title}" with a ${matchScore}% match.`,
            type: 'info',
            relatedId: newApplication._id,
            onModel: 'Application'
        });

        res.json({ msg: 'Application successful', score: matchScore });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

// --- 2. GET MY APPLICATIONS (For Candidate) ---
exports.getMyApplications = async (req, res) => {
    try {
        const candidateProfile = await Candidate.findOne({ user: req.user.id });
        if (!candidateProfile) return res.json([]); 

        const applications = await Application.find({ candidate: candidateProfile._id })
            .populate('vacancy', ['title', 'salary_min', 'salary_max', 'modality', 'status', 'created_by']) // Populate created_by to get company info later if needed
            .sort({ applied_at: -1 });

        res.json(applications);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

// --- 3. GET APPLICATIONS BY RECRUITER ---
exports.getApplicationsByRecruiter = async (req, res) => {
    try {
        // A. Find all vacancies created by this recruiter
        const MyVacancies = await Vacancy.find({ created_by: req.user.id });
        
        if (MyVacancies.length === 0) {
            return res.json([]); 
        }

        const vacancyIds = MyVacancies.map(v => v._id);

        // B. Find applications for these vacancies
        const applications = await Application.find({ vacancy: { $in: vacancyIds } })
            .populate('candidate', ['user', 'full_name', 'email', 'title', 'skills', 'experience_years', 'cv_url', 'phone', 'location', 'photo_url']) 
            .populate('vacancy', 'title')
            .sort({ ai_score: -1 }); // Sort by best AI match

        res.json(applications);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

// --- 4. UPDATE STATUS (KANBAN & NOTIFICATIONS) ---
exports.updateStatus = async (req, res) => {
    try {
        const { status } = req.body; 
        const applicationId = req.params.id;

        // Validate status
        const validStatuses = ['nuevo', 'entrevista', 'rechazado', 'contratado'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ msg: 'Invalid Status' });
        }

        // 1. Update Application
        const app = await Application.findByIdAndUpdate(
            applicationId, 
            { $set: { status: status } }, 
            { new: true }
        )
        // Populate candidate to get the User ID for notification, and vacancy for the title
        .populate({
            path: 'candidate',
            select: 'user full_name' 
        })
        .populate('vacancy', 'title');

        if (!app) return res.status(404).json({ msg: 'Application not found' });

        // 2. CREATE AUTOMATIC NOTIFICATION
        let notifTitle = 'Application Update';
        let notifMsg = `Your status for "${app.vacancy.title}" has changed to: ${status}.`;
        let notifType = 'info';

        if (status === 'entrevista') {
            notifTitle = 'Congratulations! Interview Stage';
            notifMsg = `The company wants to interview you for "${app.vacancy.title}". Check your email soon.`;
            notifType = 'success';
        } else if (status === 'rechazado') {
            notifTitle = 'Process Update';
            notifMsg = `Thank you for your interest in "${app.vacancy.title}". The company has decided not to proceed with your profile at this time.`;
            notifType = 'error';
        } else if (status === 'contratado') {
            notifTitle = 'You are Hired! 🎉';
            notifMsg = `Congratulations! You have been selected for the position "${app.vacancy.title}".`;
            notifType = 'success';
        }

        // Verify we have the user ID to send notification
        if (app.candidate && app.candidate.user) {
            await Notification.create({
                user: app.candidate.user, 
                title: notifTitle,
                message: notifMsg,
                type: notifType
            });
        }

        res.json(app);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

// --- 5. GET RECRUITER AGENDA (Candidates in 'entrevista' status) ---
exports.getRecruiterAgenda = async (req, res) => {
    try {
        // 1. My vacancies
        const myVacancies = await Vacancy.find({ created_by: req.user.id });
        const vacancyIds = myVacancies.map(v => v._id);

        // 2. Find applications in 'entrevista' status
        const agenda = await Application.find({ 
            vacancy: { $in: vacancyIds },
            status: 'entrevista'
        })
        .populate('candidate', 'full_name photo_url')
        .populate('vacancy', 'title')
        .sort({ interview_date: 1 });

        res.json(agenda);

    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading agenda');
    }
};