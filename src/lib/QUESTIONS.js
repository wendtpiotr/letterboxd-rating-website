export const QUESTIONS = {
    universal: [
        {
            id: 'story',
            text: 'How compelling was the narrative and plot progression?',
            weight: 1.2,
            focusAreas: ['Plot structure', 'Story engagement', 'Narrative flow', 'Setup & payoff']
        },
        {
            id: 'pacing',
            text: 'Did the film maintain good momentum throughout?',
            weight: 0.9,
            focusAreas: ['Scene transitions', 'Runtime feel', 'No dragging parts', 'Energy consistency']
        },
        {
            id: 'acting',
            text: 'How believable and engaging were the performances?',
            weight: 1.1,
            focusAreas: ['Character believability', 'Emotional delivery', 'Chemistry', 'Performance range']
        },
        {
            id: 'visuals',
            text: 'How appealing was the overall visual presentation?',
            weight: 0.9,
            focusAreas: ['Shot composition', 'Color palette', 'Visual style', 'Image quality']
        },
        {
            id: 'soundtrack',
            text: 'How well did the music enhance the experience?',
            weight: 0.8,
            focusAreas: ['Music fitting', 'Emotional enhancement', 'Memorable themes', 'Audio balance']
        },
        {
            id: 'emotional',
            text: 'How deeply did the film impact you emotionally?',
            weight: 1.1,
            focusAreas: ['Emotional resonance', 'Connection to story', 'Memorable moments', 'Lasting impact']
        },
        {
            id: 'originality',
            text: 'How fresh did the film feel to you?',
            weight: 1.0,
            focusAreas: ['Unique ideas', 'Fresh perspective', 'Avoiding clichés', 'Creative choices']
        },
        {
            id: 'satisfaction',
            text: 'How satisfied were you with the ending?',
            weight: 1.0,
            focusAreas: ['Resolution quality', 'Emotional closure', 'Loose ends tied', 'Satisfying conclusion']
        }
    ],
    Action: [
        {
            id: 'choreography',
            text: 'How exciting were the action sequences?',
            weight: 1.4,
            focusAreas: ['Fight choreography', 'Creativity', 'Spectacle', 'Intensity']
        },
        {
            id: 'clarity',
            text: 'Could you follow what was happening in action scenes?',
            weight: 1.1,
            focusAreas: ['Shot clarity', 'Spatial awareness', 'Camera steadiness', 'Visual coherence']
        },
        {
            id: 'stakes',
            text: 'Did you feel genuine tension during action moments?',
            weight: 1.1,
            focusAreas: ['Danger felt real', 'Consequences clear', 'Investment in outcome', 'Suspense']
        }
    ],
    Drama: [
        {
            id: 'character_depth',
            text: 'How well-developed did the characters feel?',
            weight: 1.4,
            focusAreas: ['Character arcs', 'Motivations clear', 'Complexity', 'Growth shown']
        },
        {
            id: 'dialogue',
            text: 'How natural and meaningful was the dialogue?',
            weight: 1.2,
            focusAreas: ['Realistic speech', 'Subtext', 'Memorable lines', 'Character voices']
        },
        {
            id: 'themes',
            text: 'How thought-provoking were the themes explored?',
            weight: 1.1,
            focusAreas: ['Theme clarity', 'Depth of exploration', 'Relevance', 'Subtlety']
        }
    ],
    Horror: [
        {
            id: 'atmosphere',
            text: 'How effectively did it build dread and unease?',
            weight: 1.4,
            focusAreas: ['Constant tension', 'Uncomfortable feeling', 'Building dread', 'Mood consistency']
        },
        {
            id: 'scares',
            text: 'How effective were the frightening moments?',
            weight: 1.2,
            focusAreas: ['Jump scares', 'Disturbing imagery', 'Psychological fear', 'Lasting unease']
        },
        {
            id: 'cinematography',
            text: 'How well did lighting and camera work create tension?',
            weight: 1.3,
            focusAreas: ['Shadows & lighting', 'Camera angles', 'Visual mystery', 'Composition']
        },
        {
            id: 'sound_design',
            text: 'How unsettling was the audio and sound design?',
            weight: 1.1,
            focusAreas: ['Creepy sounds', 'Silence use', 'Audio cues', 'Ambient noise']
        }
    ],
    Comedy: [
        {
            id: 'humor',
            text: 'How funny did you find it?',
            weight: 1.5,
            focusAreas: ['Laugh frequency', 'Joke quality', 'Humor style', 'Personal enjoyment']
        },
        {
            id: 'timing',
            text: 'How well-timed were the comedic moments?',
            weight: 1.2,
            focusAreas: ['Punchline delivery', 'Beat timing', 'Rhythm', 'Setup execution']
        },
        {
            id: 'consistency',
            text: 'Did it maintain comedic quality throughout?',
            weight: 1.0,
            focusAreas: ['Consistent laughs', 'No dead zones', 'Energy maintained', 'Quality steady']
        }
    ],
    SciFi: [
        {
            id: 'worldbuilding',
            text: 'How immersive was the sci-fi world?',
            weight: 1.3,
            focusAreas: ['World details', 'Believability', 'Consistency', 'Depth of lore']
        },
        {
            id: 'concepts',
            text: 'How interesting were the sci-fi ideas presented?',
            weight: 1.2,
            focusAreas: ['Concept originality', 'Exploration depth', 'Thought-provoking', 'Imagination']
        },
        {
            id: 'effects',
            text: 'How impressive were the visual effects?',
            weight: 1.1,
            focusAreas: ['CGI quality', 'Effect believability', 'Visual creativity', 'Technical execution']
        }
    ],
    Romance: [
        {
            id: 'chemistry',
            text: 'How believable was the chemistry between leads?',
            weight: 1.5,
            focusAreas: ['Actor chemistry', 'Natural connection', 'Spark visible', 'Relationship feel']
        },
        {
            id: 'believability',
            text: 'Did the romance feel genuine and earned?',
            weight: 1.2,
            focusAreas: ['Relationship development', 'Realistic progression', 'Earned moments', 'Not forced']
        },
        {
            id: 'emotional_beats',
            text: 'How affecting were the romantic moments?',
            weight: 1.1,
            focusAreas: ['Emotional impact', 'Key scene power', 'Heartfelt moments', 'Touching scenes']
        }
    ],
    Thriller: [
        {
            id: 'suspense',
            text: 'How tense and gripping was the experience?',
            weight: 1.4,
            focusAreas: ['Edge of seat', 'Tension building', 'Sustained anxiety', 'Gripping feel']
        },
        {
            id: 'twists',
            text: 'How satisfying were the plot revelations?',
            weight: 1.2,
            focusAreas: ['Twist quality', 'Surprise level', 'Earned reveals', 'Foreshadowing']
        },
        {
            id: 'unpredictability',
            text: 'How unpredictable was the story?',
            weight: 1.1,
            focusAreas: ['Surprise factor', 'Avoided clichés', 'Kept guessing', 'Fresh turns']
        }
    ],
    Mystery: [
        {
            id: 'puzzle',
            text: 'How engaging was the central mystery?',
            weight: 1.4,
            focusAreas: ['Mystery intrigue', 'Question hook', 'Puzzle complexity', 'Investigation interest']
        },
        {
            id: 'clues',
            text: 'Did you feel you had a fair chance to solve it?',
            weight: 1.2,
            focusAreas: ['Clue clarity', 'Fair play', 'No cheating', 'Solvable puzzle']
        },
        {
            id: 'resolution',
            text: 'How satisfying was the mystery\'s solution?',
            weight: 1.3,
            focusAreas: ['Answer quality', 'Makes sense', 'Worth the wait', 'Clever solution']
        }
    ],
    Animation: [
        {
            id: 'animation_quality',
            text: 'How impressive was the animation quality?',
            weight: 1.3,
            focusAreas: ['Movement fluidity', 'Frame quality', 'Technical skill', 'Detail level']
        },
        {
            id: 'art_style',
            text: 'How appealing was the visual art style?',
            weight: 1.2,
            focusAreas: ['Style uniqueness', 'Visual beauty', 'Design consistency', 'Aesthetic appeal']
        },
        {
            id: 'voice_acting',
            text: 'How well did the voice performances work?',
            weight: 1.0,
            focusAreas: ['Voice fitting', 'Emotional delivery', 'Character match', 'Performance quality']
        }
    ],
    Fantasy: [
        {
            id: 'world',
            text: 'How immersive was the fantasy world?',
            weight: 1.3,
            focusAreas: ['World depth', 'Believability', 'Immersion level', 'Lore richness']
        },
        {
            id: 'magic_system',
            text: 'Did the magical elements feel consistent?',
            weight: 1.0,
            focusAreas: ['Magic rules', 'System logic', 'Consistency', 'Power clarity']
        },
        {
            id: 'spectacle',
            text: 'How visually stunning were the fantasy elements?',
            weight: 1.1,
            focusAreas: ['Visual wow factor', 'Magical effects', 'Epic moments', 'Fantasy imagery']
        }
    ],
    Documentary: [
        {
            id: 'information',
            text: 'How informative and educational was it?',
            weight: 1.4,
            focusAreas: ['Learning value', 'Information depth', 'Facts presented', 'Knowledge gained']
        },
        {
            id: 'perspective',
            text: 'How interesting was the perspective presented?',
            weight: 1.2,
            focusAreas: ['Viewpoint clarity', 'Argument strength', 'Balance/bias', 'Angle uniqueness']
        },
        {
            id: 'engagement',
            text: 'How engaging was the storytelling approach?',
            weight: 1.1,
            focusAreas: ['Narrative flow', 'Maintains interest', 'Pacing', 'Story structure']
        }
    ],
    Crime: [
        {
            id: 'plot_intricacy',
            text: 'How intricate and clever was the criminal plot?',
            weight: 1.3,
            focusAreas: ['Plot complexity', 'Scheme cleverness', 'Details matter', 'Layered story']
        },
        {
            id: 'moral_complexity',
            text: 'How thought-provoking were the moral questions?',
            weight: 1.2,
            focusAreas: ['Ethical dilemmas', 'Gray areas', 'Moral depth', 'Questions raised']
        },
        {
            id: 'realism',
            text: 'How authentic did the crime world feel?',
            weight: 1.0,
            focusAreas: ['World authenticity', 'Procedural accuracy', 'Realistic feel', 'Believability']
        }
    ],
    Western: [
        {
            id: 'setting',
            text: 'How immersive was the Western atmosphere?',
            weight: 1.2,
            focusAreas: ['Frontier feel', 'Setting authenticity', 'Atmosphere', 'Time period']
        },
        {
            id: 'morality',
            text: 'How compelling were the moral conflicts?',
            weight: 1.1,
            focusAreas: ['Moral dilemmas', 'Code of honor', 'Right vs wrong', 'Character ethics']
        },
        {
            id: 'authenticity',
            text: 'How authentic did the period feel?',
            weight: 0.9,
            focusAreas: ['Historical accuracy', 'Period details', 'Costume/props', 'Era feeling']
        }
    ],
    Adventure: [
        {
            id: 'journey',
            text: 'How exciting was the adventure journey?',
            weight: 1.3,
            focusAreas: ['Journey excitement', 'Quest engagement', 'Travel appeal', 'Adventure feel']
        },
        {
            id: 'scale',
            text: 'How epic did the adventure feel?',
            weight: 1.1,
            focusAreas: ['Scope & scale', 'Grand moments', 'Epic feeling', 'Size impression']
        },
        {
            id: 'discovery',
            text: 'How rewarding were the discoveries made?',
            weight: 1.0,
            focusAreas: ['Discovery payoff', 'Reveal satisfaction', 'Finding value', 'Worth the journey']
        }
    ]
};