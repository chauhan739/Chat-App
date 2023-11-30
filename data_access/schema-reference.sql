CREATE TABLE users (
  email VARCHAR(255) PRIMARY KEY UNIQUE,
  password VARCHAR(255),
  username VARCHAR(255),
  verified BOOLEAN DEFAULT false
);

CREATE TABLE userinfo(
  company VARCHAR(255) DEFAULT 'N/A',
  designation VARCHAR(255) DEFAULT 'N/A',
  dob VARCHAR(255) DEFAULT 'N/A',
  email VARCHAR(255) REFERENCES users(email),
  pfp VARCHAR(255) DEFAULT 'https://res.cloudinary.com/aryan-cloud/image/upload/v1698043948/image-removebg-preview_qwleew.png',
  sex VARCHAR(10) DEFAULT 'N/A',
  blood_group VARCHAR(10) DEFAULT 'N/A'
);
SELECT * FROM userinfo


CREATE TABLE otps (
  id SERIAL PRIMARY KEY,
  otp VARCHAR(6),
  email VARCHAR(255) REFERENCES users(email)
);

CREATE TABLE posts (
  postid SERIAL PRIMARY KEY,
  email TEXT REFERENCES users(email),
  title VARCHAR(150),
  date_created TIMESTAMP DEFAULT NOW(),
  description TEXT,
  image_url TEXT,
  comments INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  category varchar default 'general' check(category in('sports', 'entertainment','politics', 'travel', 'finance')),
  verified boolean default False
);

CREATE TABLE comments (
	commentid SERIAL PRIMARY KEY,
	postid INTEGER REFERENCES posts(postid),
	email TEXT REFERENCES users(email),
	comment TEXT,
	date_created TIMESTAMP DEFAULT NOW()
);
TRUNCATE TABLE comments CASCADE

CREATE TABLE likes (
	likeid SERIAL PRIMARY KEY,
	postid INTEGER REFERENCES posts(postid),
	email TEXT REFERENCES users(email),
	date_created TIMESTAMP DEFAULT NOW()
);

SELECT * FROM userinfo

SELECT * FROM comments
SELECT * FROM likes

SELECT * FROM users WHERE verified = false;

DELETE FROM users WHERE verified = false;

-- TRIGGER FOR CRETING DEFAULT USERINFO ENTRY ON NEW USER REGISTRATION 
CREATE OR REPLACE FUNCTION create_userinfo_entry()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO userinfo (email)
    VALUES (NEW.email);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_userinfo_trigger
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION create_userinfo_entry();


-- TRIGGER FOR COMMENTS COUNT
CREATE OR REPLACE FUNCTION increment_comments_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE posts
    SET comments = comments + 1
    WHERE postid = NEW.postid;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER comments_increment_trigger
AFTER INSERT ON comments
FOR EACH ROW
EXECUTE FUNCTION increment_comments_count();



-- TRIGGER FUNCTION FOR INCREMENTING LIKES COUNT IN POSTS TABLE
CREATE OR REPLACE FUNCTION increment_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE posts
    SET likes = likes + 1
    WHERE postid = NEW.postid;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER likes_increment_trigger
AFTER INSERT ON likes
FOR EACH ROW
EXECUTE FUNCTION increment_likes_count();


-- TRIGGER FUNCTION FOR DECREMENTING LIKES COUNT IN POSTS TABLE
CREATE OR REPLACE FUNCTION decrement_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE posts
    SET likes = likes - 1
    WHERE postid = OLD.postid;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER likes_decrement_trigger
AFTER DELETE ON likes
FOR EACH ROW
EXECUTE FUNCTION decrement_likes_count();




SELECT u.email AS user_email, u.username, u.password, u.verified,
o.id AS otp_id, o.otp
FROM users AS u, otps AS o
WHERE u.email = o.email

SELECT u.email, u.verified AS user_verified,
p.postid, p.comments, p.likes, p.title, p.date_created, p.category, p.image_url, p.verified AS post_verified, p.likes, p.comments
FROM users AS u, posts AS p
WHERE u.email = p.email
ORDER BY p.postid DESC

INSERT INTO userinfo (company, designation, age, email, sex, blood_group) VALUES
	('Amazon', 'SDE-1', '23', 'test@example.com', 'Male', 'A+');




SELECT 
    userinfo.*,
    users.username,
    COUNT(posts.postid) AS post_count,
    SUM(posts.likes) AS total_likes
FROM 
    userinfo
JOIN 
    users ON userinfo.email = users.email
LEFT JOIN 
    posts ON userinfo.email = posts.email
WHERE 
    userinfo.email = (
        SELECT email FROM posts WHERE postid = '16'
    )
GROUP BY 
    userinfo.email, 
    userinfo.company,
    userinfo.designation,
    userinfo.dob,
    userinfo.pfp,
    userinfo.sex,
    userinfo.blood_group,
    users.username;






