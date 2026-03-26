-- =====================================================
-- SCRIPT PARA GERAÇÃO DE DADOS FAKE PARA TESTES
-- =====================================================
-- USE ESTE SCRIPT APENAS EM AMBIENTE DE DESENVOLVIMENTO
-- 
-- Execução:
-- docker exec database psql -U seu_usuario -d sua_database -f dados_fake_para_teste.sql
--
-- Ou manualmente dentro do container:
-- docker exec -it database psql -U seu_usuario -d sua_database
-- \i /path/do/arquivo/dados_fake_para_teste.sql
-- =====================================================

-- Limpar dados anteriores (CUIDADO!)
-- TRUNCATE TABLE conteudos CASCADE;
-- TRUNCATE TABLE aulas CASCADE;
-- TRUNCATE TABLE disciplinas CASCADE;
-- TRUNCATE TABLE users CASCADE;

-- =====================================================
-- INSERIR USUÁRIOS (Professores e Alunos)
-- =====================================================
INSERT INTO users (name, email, password, type, created_at, updated_at) VALUES
('Prof. João Silva', 'joao.silva@educara.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/iu', 'Professor', NOW(), NOW()),
('Prof. Maria Santos', 'maria.santos@educara.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/iu', 'Professor', NOW(), NOW()),
('Prof. Carlos Oliveira', 'carlos.oliveira@educara.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/iu', 'Professor', NOW(), NOW()),
('Aluno Pedro Alves', 'pedro.alves@student.educara.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/iu', 'Aluno', NOW(), NOW()),
('Aluno Ana Costa', 'ana.costa@student.educara.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/iu', 'Aluno', NOW(), NOW()),
('Aluno Bruno Ferreira', 'bruno.ferreira@student.educara.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/iu', 'Aluno', NOW(), NOW()),
('Aluno Lucia Martins', 'lucia.martins@student.educara.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/iu', 'Aluno', NOW(), NOW());

-- =====================================================
-- INSERIR DISCIPLINAS
-- =====================================================
INSERT INTO disciplinas (codigo, nome, sigla, imagem, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Matemática', 'MAT', '/images/disciplinas/matematica.jpg', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'Português', 'PORT', '/images/disciplinas/portugues.jpg', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'Ciências', 'CIEN', '/images/disciplinas/ciencias.jpg', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440004', 'História', 'HIST', '/images/disciplinas/historia.jpg', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440005', 'Inglês', 'ING', '/images/disciplinas/ingles.jpg', NOW(), NOW());

-- =====================================================
-- INSERIR AULAS
-- =====================================================
INSERT INTO aulas (codigo, nome, observacao, turma, dono_id, disciplina_id, created_at, updated_at, deleted_at) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'Funções Quadráticas', 'Aula sobre gráficos e propriedades', '2º Ano A', 1, 1, NOW(), NOW(), NULL),
('650e8400-e29b-41d4-a716-446655440002', 'Trigonometria', 'Seno, cosseno e tangente', '2º Ano B', 1, 1, NOW(), NOW(), NULL),
('650e8400-e29b-41d4-a716-446655440003', 'Análise Sintática', 'Estrutura das sentenças', '1º Ano A', 2, 2, NOW(), NOW(), NULL),
('650e8400-e29b-41d4-a716-446655440004', 'Ecossistemas', 'Biomas e cadeias alimentares', '3º Ano A', 3, 3, NOW(), NOW(), NULL),
('650e8400-e29b-41d4-a716-446655440005', 'Revolução Francesa', 'Contexto histórico e consequências', '2º Ano C', 2, 4, NOW(), NOW(), NULL),
('650e8400-e29b-41d4-a716-446655440006', 'Present Perfect', 'Tempos verbais em inglês', '1º Ano B', 3, 5, NOW(), NOW(), NULL);

-- =====================================================
-- INSERIR CONTEÚDOS (Objetos 3D e Arquivos)
-- =====================================================
INSERT INTO conteudos (codigo, nome, descricao, imagem, filehash, caminho, size, escala, extension, aula_id, created_at, updated_at) VALUES
('750e8400-e29b-41d4-a716-446655440001', 'Parábola 3D', 'Visualização 3D de uma função quadrática', NULL, 'abc123def456', 'modelos/Etanol.zip', 2.5, 0.8, 'zip', 1, NOW(), NOW()),
('750e8400-e29b-41d4-a716-446655440002', 'Gráfico Interativo', 'Gráfico animado de movimento', NULL, 'xyz789uvw123', 'modelos/Etanol.zip', 1.2, 1.0, 'zip', 1, NOW(), NOW()),
('750e8400-e29b-41d4-a716-446655440003', 'Círculo Trigonométrico', 'Representação do ciclo trigonométrico', NULL, 'def456ghi789', 'modelos/Etanol.zip', 3.1, 0.5, 'zip', 2, NOW(), NOW()),
('750e8400-e29b-41d4-a716-446655440004', 'Célula Animal', 'Modelo 3D de uma célula animal', NULL, 'jkl123mno456', 'modelos/Etanol.zip', 4.8, 1.2, 'zip', 4, NOW(), NOW()),
('750e8400-e29b-41d4-a716-446655440005', 'DNA Dupla Hélice', 'Estrutura da molécula de DNA', NULL, 'pqr789stu012', 'modelos/Etanol.zip', 2.3, 0.6, 'zip', 4, NOW(), NOW()),
('750e8400-e29b-41d4-a716-446655440006', 'Mapa Político - França', 'Mapa em 3D da revolução francesa', NULL, 'vwx345yz678', 'modelos/Etanol.zip', 3.5, 0.9, 'zip', 5, NOW(), NOW()),
('750e8400-e29b-41d4-a716-446655440007', 'Vocabulário Inglês', 'Objetos com pronunciação em inglês', NULL, 'abc111def222', 'modelos/Etanol.zip', 1.8, 0.7, 'zip', 6, NOW(), NOW());

-- =====================================================
-- Resumo dos dados inseridos:
-- =====================================================
-- Usuários: 3 Professores + 4 Alunos = 7 total
-- Disciplinas: 5
-- Aulas: 6
-- Conteúdos/Modelos 3D: 7
-- =====================================================

SELECT 'Dados de teste inseridos com sucesso!' AS resultado;
