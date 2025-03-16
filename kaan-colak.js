(() => {
    const self = {};

    self.init = () => {
        self.buildHTML();
        self.buildCSS();
        self.setEvents();
        self.fetchProducts();
    };

    self.buildHTML = () => {
        const html = `
            <div id="product-carousel">
                <h2>You Might Also Like</h2>
                <div class="carousel-wrapper">
                    <button id="prev-btn">&#10094;</button>
                    <div class="carousel-track"></div>
                    <button id="next-btn">&#10095;</button>
                </div>
            </div>
        `;
        document.querySelector('.product-detail').insertAdjacentHTML('afterend', html);
    };

    self.buildCSS = () => {
        const css = `
            #product-carousel {
                width: 100%;
                padding: 20px;
                overflow: hidden;
            }
            .carousel-wrapper {
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
            }
            .carousel-track {
                display: flex;
                overflow-x: auto;
                scroll-behavior: smooth;
                white-space: nowrap;
                gap: 10px;
                width: 90%;
            }
            .carousel-track::-webkit-scrollbar {
                display: none;
            }
            .product-card {
                display: inline-block;
                width: 150px;
                margin: 10px;
                border: 1px solid #ccc;
                padding: 10px;
                text-align: center;
                border-radius: 5px;
                background: #fff;
                box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
                position: relative;
            }
            .product-card img {
                width: 100%;
                height: 150px;
                object-fit: cover;
                border-radius: 5px;
                margin-bottom: 10px;
                background: #f0f0f0;
            }
            .product-card h3 {
                font-size: 14px;
                font-weight: normal;
                color: #333;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                text-decoration: none !important; /* ALT ÇİZGİYİ KALDIR */
            }
            .product-card .price {
                font-size: 16px;
                font-weight: bold;
                color: blue;
                margin: 5px 0;
                text-decoration: none !important; /* ALT ÇİZGİYİ KALDIR */
            }
            .favorite {
                cursor: pointer;
                font-size: 20px;
                color: gray;
                position: absolute;
                top: 10px;
                right: 10px;
                background: white;
                border-radius: 50%;
                padding: 5px;
                box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
            }
            .favorite.active {
                color: blue;
            }
            button {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
            }
        `;
        const style = document.createElement('style');
        style.innerHTML = css;
        document.head.appendChild(style);
    };

    self.setEvents = () => {
        document.getElementById('prev-btn').addEventListener('click', () => {
            document.querySelector('.carousel-track').scrollBy({ left: -200, behavior: 'smooth' });
        });

        document.getElementById('next-btn').addEventListener('click', () => {
            document.querySelector('.carousel-track').scrollBy({ left: 200, behavior: 'smooth' });
        });
    };

    self.fetchProducts = async () => {
        const PRODUCTS_API = "https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json";
        let products = JSON.parse(localStorage.getItem('products'));

        if (!products) {
            try {
                const response = await fetch(PRODUCTS_API);
                products = await response.json();
                localStorage.setItem('products', JSON.stringify(products));
            } catch (error) {
                console.error("Ürünler yüklenirken hata oluştu: ", error);
                return [];
            }
        }

        self.renderProducts(products);
    };

    self.renderProducts = (products) => {
        const track = document.querySelector('.carousel-track');
        track.innerHTML = '';

        const favoriteProducts = JSON.parse(localStorage.getItem('favorites')) || [];

        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.innerHTML = `
                <a href="${product.url}" target="_blank">
                    <img src="${product.img}" onerror="this.onerror=null;this.src='https://via.placeholder.com/150?text=No+Image'" />
                    <h3>${product.name}</h3>
                    <p class="price">${product.price} TL</p>
                </a>
                <span class="favorite" data-id="${product.id}">♥</span>
            `;
            track.appendChild(productCard);
        });

        self.attachFavoriteEvents();
    };

    self.attachFavoriteEvents = () => {
        const favoriteProducts = JSON.parse(localStorage.getItem('favorites')) || [];

        document.querySelectorAll('.favorite').forEach(heart => {
            const productId = heart.getAttribute('data-id');
            if (favoriteProducts.includes(productId)) {
                heart.classList.add('active');
            }
            heart.addEventListener('click', function() {
                let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
                if (favorites.includes(productId)) {
                    favorites = favorites.filter(id => id !== productId);
                    this.classList.remove('active');
                } else {
                    favorites.push(productId);
                    this.classList.add('active');
                }
                localStorage.setItem('favorites', JSON.stringify(favorites));
            });
        });
    };

    self.init();
})();
