// Para leitores futuro

// Inicializa o contador de itens no carrinho e o total
let cartCount = 0;
let cartTotal = 0;
const cartItems = [];

// Atualiza a nota fiscal
function updateNotaFiscal() {
  const notaFiscalItens = document.getElementById("nota-fiscal-itens");
  notaFiscalItens.innerHTML = "";

  // Adiciona itens do carrinho à nota fiscal
  cartItems.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `${item.name} x ${item.quantity} - R$ ${(item.price * item.quantity).toFixed(2)}`;
    
    // Cria o botão "X"
    const removeButton = document.createElement("button");
    removeButton.innerText = "X";
    removeButton.style.color = "red";
    removeButton.style.marginLeft = "auto";
    removeButton.style.border = "none";
    removeButton.style.background = "none";
    removeButton.style.cursor = "pointer";
    removeButton.style.overflow = "hidden"
    removeButton.style.fontSize = "20px"
    removeButton.style.fontWeight = "bold"

    // Adiciona evento de clique para remover o item
    removeButton.addEventListener("click", () => {
      cartTotal -= item.price * item.quantity; // Atualiza o total
      cartCount -= item.quantity; // Atualiza o contador de itens
      cartItems.splice(index, 1); // Remove o item do carrinho

      updateCartSummary();
      updateNotaFiscal();
    });

    li.appendChild(removeButton); // Adiciona o botão "X" ao item
    notaFiscalItens.appendChild(li); // Adiciona o item à nota fiscal
  });

  // Atualiza o total da nota fiscal
  document.getElementById("nota-fiscal-total").innerText = cartTotal.toFixed(2);
}

// Evento para cada botão do menu
document.querySelectorAll(".menu-item button").forEach((button) => {
  const originalColor = getComputedStyle(button).backgroundColor;

  button.addEventListener("click", () => {
    const itemName = button.parentElement.querySelector("h3").innerText;
    const itemPrice = parseFloat(
      button.parentElement
        .querySelector(".item-price")
        .innerText.replace("R$ ", "").replace(",", ".")
    );

    cartCount++;
    cartTotal += itemPrice;
    const existingItem = cartItems.find(item => item.name === itemName);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      cartItems.push({ name: itemName, price: itemPrice, quantity: 1 });
    }

    updateCartSummary();
    updateNotaFiscal();

    // Atualiza a cor do botão e das setas
    const section = button.closest(".menu-section");
    const sectionColor = getComputedStyle(section).backgroundColor;
    button.style.backgroundColor = sectionColor;

    const setas = section.querySelectorAll(".nav-button");
    setas.forEach((seta) => {
      seta.style.backgroundColor = sectionColor;
    });
  });

  button.addEventListener("mouseout", () => {
    button.style.backgroundColor = originalColor;
    const section = button.closest(".menu-section");
    const setas = section.querySelectorAll(".nav-button");
    setas.forEach((seta) => {
      seta.style.backgroundColor = originalColor;
    });
  });
});

// Função para atualizar o resumo do carrinho
function updateCartSummary() {
  document.getElementById("carrinho-count").innerText = cartCount;
  document.getElementById("carrinho-total").innerText = cartTotal.toFixed(2);
}

// Evento de clique ao botão "Mais Detalhes"
document.getElementById("mais-detalhes").addEventListener("click", () => {
  const notaFiscal = document.getElementById("nota-fiscal");
  updateNotaFiscal(); // Atualiza a nota fiscal ao abrir
  notaFiscal.style.display = "flex"; // Mostra a nota fiscal
});

// Evento para fechar a nota fiscal
document.getElementById("fechar-nota").addEventListener("click", () => {
  document.getElementById("nota-fiscal").style.display = "none";
});

document.getElementById("limpar-carrinho").addEventListener("click", () => {
  cartCount = 0;
  cartTotal = 0;
  cartItems.length = 0; // Limpa o array
  updateCartSummary(); 
  document.getElementById("carrinho-itens").innerHTML = ""; // Limpa os itens do resumo do carrinho
  updateNotaFiscal(); 
});

// Adiciona evento de clique ao botão do carrinho
document.getElementById("carrinho").addEventListener("click", () => {
  const cartResumo = document.getElementById("carrinho-resumo");
  const isVisible = cartResumo.style.display === "block";

  cartResumo.style.display = isVisible ? "none" : "block";
});

// Adiciona evento de clique aos links de navegação
document.querySelectorAll("nav ul li a").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();

    const sectionId = link.getAttribute("href"); // Obtém o ID da seção
    const section = document.querySelector(sectionId); // Seleciona a seção correspondente

    // Calcula a posição da seção e subtrai a altura da barra de navegação
    const navHeight = document.querySelector("header").offsetHeight; // Altura da barra de navegação
    const sectionTop = section.getBoundingClientRect().top + window.scrollY - navHeight;

    // Rola suavemente até a seção
    window.scrollTo({ top: sectionTop, behavior: "smooth" });

    // Atualiza a classe "active" após a rolagem
    updateActiveLink();
  });
});

// Função para atualizar a classe "active" na barra de navegação
function updateActiveLink() {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll("nav ul li");

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;

    // Aumenta a área de detecção
    if (
      pageYOffset >= sectionTop - sectionHeight / 2 &&
      pageYOffset < sectionTop + sectionHeight
    ) {
      navLinks.forEach((link) => link.classList.remove("active"));
      const activeLink = document.querySelector(
        `nav ul li a[href="#${section.id}"]`
      );
      if (activeLink) {
        activeLink.parentElement.classList.add("active"); // Adiciona a classe "active" ao <li>
      }
    }
  });
}

// Adiciona evento de rolagem para atualizar a classe "active"
window.addEventListener("scroll", updateActiveLink);

// Evento para imprimir a nota fiscal
document.getElementById("imprimir-nota-fiscal").addEventListener("click", () => {
  const notaFiscal = document.getElementById("nota-fiscal");
  const notaFiscalItens = document.getElementById("nota-fiscal-itens").innerHTML;
  const notaFiscalTotal = document.getElementById("nota-fiscal-total").innerText;

  // Criar um documento temporário
  const printWindow = window.open('', '_blank', 'width=600,height=400');
  printWindow.document.write(`
    <html>
      <head>
        <title>Nota Fiscal</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { text-align: center; }
          ul { list-style-type: none; padding: 0; }
          li { margin: 10px 0; }
          .total { font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>Resumo da Compra</h1>
        <ul>${notaFiscalItens}</ul>
        <div class="total">Total: R$ ${notaFiscalTotal}</div>
      </body>
      <br>
      <hr>
      <br>
      <footer>Dá um desconto, fiz esse site em 4 horas no máximo :(</footer>
    </html>
  `);
  
  printWindow.document.close();
  printWindow.print();
  printWindow.close();
});


// Evento para finalizar compra
document.getElementById("finalizar-compra").addEventListener("click", () => {
  alert("Compra finalizada!"); // Exemplo de alerta

  // Fecha a nota fiscal
  document.getElementById("nota-fiscal").style.display = "none";

  // Limpa o carrinho
  cartCount = 0;
  cartTotal = 0;
  cartItems.length = 0; // Limpa o array
  updateCartSummary(); 
  document.getElementById("carrinho-itens").innerHTML = ""; // Limpa os itens do resumo do carrinho

  // Fecha o resumo do carrinho
  document.getElementById("carrinho-resumo").style.display = "none";
});
// Função para rolar o menu horizontalmente
function scrollMenu(sectionId, direction) {
  const menu = document.getElementById(`menu-${sectionId}`);
  const scrollAmount = 600; // Ajuste a quantidade de scroll conforme necessário
  menu.scrollBy({
      left: direction * scrollAmount,
      behavior: 'smooth'
  });
}

// Adiciona evento de clique aos botões de rolagem
document.querySelectorAll(".nav-button").forEach((button) => {
  button.addEventListener("click", () => {
      const sectionId = button.closest(".menu-section").id; // Obtém o ID da seção
      const direction = button.classList.contains("left") ? -1 : 1; // Determina a direção
      scrollMenu(sectionId, direction); // Chama a função de scroll
  });
});
