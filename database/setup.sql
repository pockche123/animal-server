DROP TABLE IF EXISTS cats; 
DROP TABLE IF EXISTS tokens; 
DROP TABLE IF EXISTS users; 

CREATE TABLE cats(
    id INT GENERATED ALWAYS AS IDENTITY, 
    name VARCHAR (100) UNIQUE NOT NULL, 
    type VARCHAR (60) NOT NULL, 
    description VARCHAR (1000),
    habitat VARCHAR (200) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE users (
    id INT GENERATED ALWAYS AS IDENTITY,
    username VARCHAR(30) UNIQUE NOT NULL,
    password CHAR(60) NOT NULL,
    is_admin Boolean Default false,
    PRIMARY KEY (id)
);

CREATE TABLE tokens(
    id INT GENERATED ALWAYS AS IDENTITY,
    user_id INT NOT NULL, 
    token CHAR(36) UNIQUE NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);


INSERT INTO cats (name, type, description, habitat) VALUES
  ('Lion', 'Big', 'The lion is a large feline and a member of the big cat family. Known for its majestic mane, it is often referred to as the "king of the jungle."', 'Grasslands and savannas'),
  ('Domestic Cat', 'Small', 'The domestic cat, or house cat, is a small carnivorous mammal. It is often kept as a pet and is known for its playful and independent nature.', 'Homes and urban areas'),
  ('Tiger', 'Big', 'The tiger is the largest cat species and is known for its distinctive orange coat with black stripes. It is a powerful and solitary predator.', 'Various habitats, including forests and grasslands'),
  ('Siamese Cat', 'Small', 'The Siamese cat is a small to medium-sized breed known for its striking blue almond-shaped eyes and distinctive color points on its coat.', 'Homes and catteries');

