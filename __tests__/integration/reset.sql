TRUNCATE cats RESTART IDENTITY; 

INSERT INTO cats (name, type, description, habitat) VALUES
  ('Lion', 'Big', 'The lion is a large feline and a member of the big cat family. Known for its majestic mane, it is often referred to as the "king of the jungle."', 'Grasslands and savannas'),
  ('Domestic Cat', 'Small', 'The domestic cat, or house cat, is a small carnivorous mammal. It is often kept as a pet and is known for its playful and independent nature.', 'Homes and urban areas'); 