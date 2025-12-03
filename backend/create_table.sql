CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(120) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'editor', 'viewer') DEFAULT 'viewer',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE documents (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  content TEXT,
  owner_id INT NOT NULL,
  owner_name VARCHAR(50),
  owner_email VARCHAR(120),
  editors TEXT,
  viewers TEXT,
  last_edited_by VARCHAR(50),
  is_public BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id)
);
CREATE TABLE revisions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  document_id INT NOT NULL,
  content TEXT,
  title VARCHAR(200),
  author_id INT NOT NULL,
  author_name VARCHAR(50),
  author_email VARCHAR(120),
  changes VARCHAR(255),
  added_lines INT DEFAULT 0,
  removed_lines INT DEFAULT 0,
  modified_lines INT DEFAULT 0,
  total_lines INT DEFAULT 0,
  restored_from_id INT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
  FOREIGN KEY (author_id) REFERENCES users(id),
  FOREIGN KEY (restored_from_id) REFERENCES revisions(id)
);