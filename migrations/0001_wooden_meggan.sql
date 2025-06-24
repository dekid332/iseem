CREATE TABLE "leaderboard" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"wallet_address" text,
	"score" integer NOT NULL,
	"level" integer NOT NULL,
	"enemies_killed" integer NOT NULL,
	"game_time" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
