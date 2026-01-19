# 🐷 FairShare - Divisor de Despesas

Uma aplicação web para dividir despesas de grupo de forma justa e eficiente.

**🌐 Demo:** [https://gustavo-visual.github.io/FairShare/](https://gustavo-visual.github.io/FairShare/)

---

## 📱 Funcionalidades

- ✅ Adicionar participantes ao grupo
- ✅ Registar despesas (quem pagou, o quê, quanto)
- ✅ Calcular automaticamente quem deve a quem
- ✅ Suporte para várias moedas (€, $, £, R$)
- ✅ Modo escuro
- ✅ Guardar dados localmente (não perde ao atualizar)
- ✅ Partilhar resumo do acerto

---

## 🧮 Como Funciona - As Fórmulas

### **1. Total Gasto**
```
Total = Despesa₁ + Despesa₂ + Despesa₃ + ... + Despesaₙ
```

### **2. Quota Justa**
```
Quota Justa = Total ÷ Número de Pessoas
```

### **3. Saldo (para cada pessoa)**
```
Saldo = Valor Que a Pessoa Pagou − Quota Justa
```

- Se o Saldo for **positivo** → essa pessoa tem direito a receber dinheiro
- Se o Saldo for **negativo** → essa pessoa deve dinheiro

### **4. Valor do Acerto (para cada transação)**
```
Valor a Pagar = mínimo(quanto o devedor deve, quanto o credor tem a receber)
```

Depois atualiza-se:
```
Novo Saldo do Devedor = Saldo Antigo do Devedor + Valor Pago
Novo Saldo do Credor = Saldo Antigo do Credor − Valor Recebido
```

Repete-se até todos os saldos serem zero.

---

## 📝 Exemplo Prático

**Cenário:** 3 amigos numa viagem
- João pagou €60 pelo jantar
- Maria pagou €30 pelo táxi
- Carlos pagou €15 pelos snacks

**Cálculos:**

1. **Total:** 60 + 30 + 15 = **€105**

2. **Quota Justa:** 105 ÷ 3 = **€35 por pessoa**

3. **Saldos:**
   - João: 60 − 35 = **+€25** (tem a receber)
   - Maria: 30 − 35 = **−€5** (deve)
   - Carlos: 15 − 35 = **−€20** (deve)

4. **Acertos:**
   - Carlos paga €20 a João
   - Maria paga €5 a João

**Resultado:** Todos ficam a ter pago €35 cada! ✅

---

## 🛠️ Tecnologias

| Tecnologia | Uso |
|------------|-----|
| React 18 | Framework de UI |
| Vite | Build tool |
| Tailwind CSS | Estilos |
| Lucide React | Ícones |
| GitHub Pages | Hospedagem |

---

## 🚀 Como Executar Localmente

```bash
# Clonar o repositório
git clone https://github.com/Gustavo-Visual/FairShare.git

# Entrar na pasta
cd FairShare

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

A aplicação ficará disponível em `http://localhost:5173`

---

## 📄 Licença

Este projeto foi criado para fins educacionais.

---

Feito com 💚 por Gustavo
