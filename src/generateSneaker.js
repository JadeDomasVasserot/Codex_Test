const mysql = require('mysql2/promise');
const OpenAI = require('openai');
require('dotenv').config();

async function fetchUserPreferences(userId, connection) {
  const [rows] = await connection.execute(
    `SELECT interaction_action_id, COUNT(*) as count
     FROM interaction
     WHERE interaction_user_id = ?
     GROUP BY interaction_action_id`,
    [userId]
  );
  return rows;
}

function buildPrompt(preferences, prompt) {
  let likes = preferences
    .filter(p => p.interaction_action_id === 1)
    .reduce((sum, p) => sum + p.count, 0);
  let dislikes = preferences
    .filter(p => p.interaction_action_id === 0)
    .reduce((sum, p) => sum + p.count, 0);

  return `${prompt}. Based on ${likes} likes and ${dislikes} dislikes from the user, describe a new sneaker that would match their style.`;
}

async function generateSneaker({ userId, prompt = 'Create a sneaker design' }) {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sneaker_db',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined
  });

  const preferences = await fetchUserPreferences(userId, connection);
  const finalPrompt = buildPrompt(preferences, prompt);

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: finalPrompt }]
    messages: [{ role: 'user', content: finalPrompt }]
  });
  });


  await connection.end();
  await connection.end();
  return completion.data.choices[0].message.content.trim();
  return completion.choices[0].message.content.trim();
}
}

module.exports = { generateSneaker };

if (require.main === module) {
  const userId = process.argv[2] || 1;
  const userPrompt = process.argv[3];
  generateSneaker({ userId, prompt: userPrompt }).then(console.log).catch(err => {
    console.error('Error generating sneaker:', err.message || err);
    process.exit(1);
  });
}
