#!/bin/bash
# add_instructions.sh — adiciona prop instruction em todos os jogos
# Execute: bash add_instructions.sh

GAMES="/c/programas/edukids/frontend/src/games"

# SequenciaGame
sed -i 's/title="Complete a Sequência 🔢"/title="Complete a Sequência 🔢"\n      instruction="Olhe a sequência e descubra o que vem depois!"/' "$GAMES/SequenciaGame.jsx"

# DifferentGame
sed -i 's/title="Qual é o diferente? 🔍"/title="Qual é o diferente? 🔍"\n      instruction="Qual desses não combina com os outros?"/' "$GAMES/DifferentGame.jsx"

# TamanhoGame
sed -i 's/title="Ordene por Tamanho 📏"/title="Ordene por Tamanho 📏"\n      instruction="Compare os tamanhos e escolha o correto!"/' "$GAMES/TamanhoGame.jsx"

# ContarGame
sed -i 's/title="Conte os Objetos 🍎"/title="Conte os Objetos 🍎"\n      instruction="Conte com cuidado todos os objetos da imagem!"/' "$GAMES/ContarGame.jsx"

# MaiorGame
sed -i 's/title="Qual é Maior? ⚖️"/title="Qual é Maior? ⚖️"\n      instruction="Compare os números e escolha o maior!"/' "$GAMES/MaiorGame.jsx"

# SomaGame
sed -i 's/title="Soma com Frutas ➕"/title="Soma com Frutas ➕"\n      instruction="Some as frutas dos dois grupos e escolha o total!"/' "$GAMES/SomaGame.jsx"

# LetraGame
sed -i 's/title="Qual Letra É Essa? 🔤"/title="Qual Letra É Essa? 🔤"\n      instruction="Olhe bem a letra e escolha o nome correto!"/' "$GAMES/LetraGame.jsx"

# PalavraGame
sed -i 's/title="Complete a Palavra ✏️"/title="Complete a Palavra ✏️"\n      instruction="Qual letra está faltando na palavra?"/' "$GAMES/PalavraGame.jsx"

# LigaGame
sed -i 's/title="Liga Letra à Imagem 🔗"/title="Liga Letra à Imagem 🔗"\n      instruction="Com que letra começa o nome do que você vê?"/' "$GAMES/LigaGame.jsx"

# CorGame
sed -i 's/title="Identifique a Cor 🌈"/title="Identifique a Cor 🌈"\n      instruction="Que cor é essa? Escolha a resposta correta!"/' "$GAMES/CorGame.jsx"

# FormaGame
sed -i 's/title="Encaixe de Formas 🔷"/title="Encaixe de Formas 🔷"\n      instruction="Que forma geométrica você está vendo?"/' "$GAMES/FormaGame.jsx"

# IgualGame
sed -i 's/title="Encontre o Igual 👁️"/title="Encontre o Igual 👁️"\n      instruction="Encontre a figura igual à que está destacada!"/' "$GAMES/IgualGame.jsx"

echo "✅ Instructions adicionadas em todos os jogos!"
