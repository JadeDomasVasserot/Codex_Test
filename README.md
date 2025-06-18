# Codex_Test

This repository includes a small Node.js example for generating sneaker ideas based on user interactions.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env` and update the values for your MySQL database and OpenAI API key.
   The template assumes a local MAMP setup with the database `sneakerworld` running on port `8889`.

```bash
cp .env.example .env
```

3. Run the generator script with a user id. Optionally provide a custom prompt after the id:

```bash
node src/generateSneaker.js 1 "Create a futuristic running shoe"
```

The script queries the `interaction` table for the given user, builds a prompt (using the custom text if provided) and sends it to the OpenAI API to obtain a sneaker description.

## Table `interaction`

```
CREATE TABLE `interaction` (
  `interaction_id` int(11) NOT NULL,
  `interaction_user_id` int(11) DEFAULT NULL,
  `interaction_sneaker_id` varchar(255) DEFAULT NULL,
  `interaction_action_id` int(11) DEFAULT NULL,
  `interaction_timestamp` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
```
