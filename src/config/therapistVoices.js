// src/config/therapistVoices.js

import Woman1Preview from '../assets/VoiceTherapist/Alloy_preview.mp3';
import Woman2Preview from '../assets/VoiceTherapist/Fable_preview.mp3';
import Woman3Preview from '../assets/VoiceTherapist/Nova_preview.mp3';
import Woman4Preview from '../assets/VoiceTherapist/Shimmer_preview.mp3';
import Man1Preview from '../assets/VoiceTherapist/Echo_preview.mp3';
import Man2Preview from '../assets/VoiceTherapist/Onyx_preview.mp3';

export const therapistVoices = [
    {
        id: 'woman1',
        gender: 'woman',
        name: 'Woman 1',
        modelId: 'alloy', // Replace with actual model ID
        voicePreview: Woman1Preview, // Use the imported file
    },
    {
        id: 'woman2',
        gender: 'woman',
        name: 'Woman 2',
        modelId: 'fable', // Replace with actual model ID
        voicePreview: Woman2Preview, // Use the imported file
    },
    {
        id: 'woman3',
        gender: 'woman',
        name: 'Woman 3',
        modelId: 'nova', // Replace with actual model ID
        voicePreview: Woman3Preview, // Use the imported file
    },
    {
        id: 'woman4',
        gender: 'woman',
        name: 'Woman 4',
        modelId: 'shimmer', // Replace with actual model ID
        voicePreview: Woman4Preview, // Use the imported file
    },
    {
        id: 'man1',
        gender: 'man',
        name: 'Man 1',
        modelId: 'echo', // Replace with actual model ID
        voicePreview: Man1Preview, // Use the imported file
    },
    {
        id: 'man2',
        gender: 'man',
        name: 'Man 2',
        modelId: 'onyx', // Replace with actual model ID
        voicePreview: Man2Preview, // Use the imported file
    }
];
