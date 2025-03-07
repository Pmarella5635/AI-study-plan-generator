const express = require('express');
const exphbs = require('express-handlebars');
const cors = require('cors');
const path = require('path');
const { HfInference } = require("@huggingface/inference");
const admin = require('firebase-admin');

const app = express();
const port = 3001;

// Initialize Firebase Admin SDK
const serviceAccount = require('./study-plan-okcu-firebase.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Set up Handlebars
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const inference = new HfInference("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");



app.post('/generate-plan', async (req, res) => {
    const { subject, level, duration, goals } = req.body;

    const prompt = `Generate a personalized study plan for the following:
    Subject: ${subject}
    Level: ${level}
    Duration: ${duration}
    Goals: ${goals}`;

    try {
        const response = await inference.textGeneration({
            model: "mistralai/Mistral-7B-Instruct-v0.3",
            inputs: prompt,
            parameters: { 
                max_new_tokens: 2000,
                temperature: 0.7,
                top_p: 0.95,
                repetition_penalty: 1.15
            }
        });
        
        if (response && response.generated_text) {
            const generatedText = response.generated_text.replace(prompt, '').trim();
            
            const studyPlanRef = await db.collection('studyPlans').add({
                subject: subject,
                level: level,
                duration: duration,
                goals: goals,
                plan: generatedText,
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            });

            res.json({ 
                plan: generatedText,
                planId: studyPlanRef.id
            });
        } else {
            res.status(500).json({ error: 'No generated text in the response' });
        }
    } catch (error) {
        console.error('Error generating study plan:', error);
        res.status(500).json({ error: 'Failed to generate study plan', details: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
