-- Insert sample programmes for testing
INSERT INTO "Programme" (id, "nomEquipe1", "nomEquipe2", stadium, date, division, "prixA", "prixB", "createdBy", "createdAt", "updatedAt")
VALUES 
  ('prog1', 'FC Kinshasa', 'AS Vita Club', 'Stade des Martyrs', '2024-02-15 15:00:00', 'Ligue 1', 15000, 8000, 'admin-user-id', NOW(), NOW()),
  ('prog2', 'TP Mazembe', 'DC Motema Pembe', 'Stade TP Mazembe', '2024-02-20 17:00:00', 'Ligue 1', 20000, 12000, 'admin-user-id', NOW(), NOW()),
  ('prog3', 'Daring Club', 'FC Saint Eloi', 'Stade Tata Raphael', '2024-02-25 14:30:00', 'Coupe du Congo', 10000, 5000, 'admin-user-id', NOW(), NOW());

-- Note: Replace 'admin-user-id' with an actual admin user ID after creating admin users
