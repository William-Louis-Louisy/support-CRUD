        
CREATE TABLE categories
(
  id   INT         NOT NULL AUTO_INCREMENT,
  name VARCHAR(80) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE posts
(
  id            INT         NOT NULL AUTO_INCREMENT,
  title         VARCHAR(80) NOT NULL,
  content       TEXT        NOT NULL,
  category_id INT         NOT NULL,
  PRIMARY KEY (id)
);

ALTER TABLE posts
  ADD CONSTRAINT FK_categories_TO_posts
    FOREIGN KEY (category_id)
    REFERENCES categories (id)
    ON DELETE CASCADE;

        
      