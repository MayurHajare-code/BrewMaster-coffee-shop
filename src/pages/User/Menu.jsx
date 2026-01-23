import { useEffect, useMemo, useState } from "react";
import "../../styles/user/MenuPage.css";
import "../../styles/user/Card.css";
import { getCategories } from "../../services/categoryService";
import { getMenuItems } from "../../services/menuService";
import ProductCard from "../../components/User/ProductCard";
import { useSearchParams } from "react-router-dom";

const Menu = ({ addToCart }) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [maxPrice, setMaxPrice] = useState(500);
  const [sortType, setSortType] = useState("");

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();

  const fetchMenu = async () => {
    try {
      const data = await getMenuItems();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching menu:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchMenu();
    fetchCategories();
    setCurrentPage(1);

    const urlCategory =
      searchParams.get("search") || searchParams.get("category");
    if (urlCategory) {
      setSearch(urlCategory);
    }

    setCurrentPage(1);
  }, [search, category, maxPrice, sortType, searchParams]);

  //  Filtering & Sorting
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search) {
      result = result.filter((product) =>
        product.title.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (category) {
      result = result.filter((product) => product.category === category);
    }

    result = result.filter((product) => product.price <= maxPrice);

    if (sortType === "low-high") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sortType === "high-low") {
      result.sort((a, b) => b.price - a.price);
    }

    if (sortType === "az") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [products, search, category, maxPrice, sortType]);

  const ITEMS_PER_PAGE = 9;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage]);

  return (
    <>
      <section className="hero-section-allPages">
        <div className="hero-section-allPages-content">
          <h1>The BrewMaster Selection</h1>
          <p>
            From ethically sourced beans to precision brewing, explore our
            curated collection of artisanal blends and seasonal favorites.
          </p>
        </div>
      </section>

      <section className="menu-section">
        <h1 className="section-title">BrewMaster Menu's</h1>

        <div className="menu-container">
          <aside className="menu-filter">
            {/*  Search */}
            <div className="filter-group">
              <input
                type="text"
                placeholder="Search menu..."
                className="search-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/*  Category */}
            <div className="filter-group">
              <label>Category</label>
              <select
                className="filter-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/*  Price */}
            <div className="filter-group">
              <label>Price Range</label>
              <input
                type="range"
                min="0"
                max="500"
                step="1"
                className="price-range"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
              />
              <div className="price-values">
                <span>$0</span>
                <span>${maxPrice}</span>
              </div>
            </div>

            {/*  Sort */}
            <div className="filter-group">
              <label>Sort By</label>
              <div className="sort-buttons">
                <button onClick={() => setSortType("low-high")}>
                  Low → High
                </button>
                <button onClick={() => setSortType("high-low")}>
                  High → Low
                </button>
                <button onClick={() => setSortType("az")}>A → Z</button>
              </div>
            </div>

            <button
              className="clear-filter"
              onClick={() => {
                setSearch("");
                setCategory("");
                setMaxPrice(500);
                setSortType("");
              }}
            >
              Clear Filters
            </button>
          </aside>

          {/*  Menu Cards */}
          <div className="menu-lists">
            <div className="cards-box">
              {loading ? (
                <p style={{ padding: "20px", fontSize: "18px" }}>
                  Loading menu...
                </p>
              ) : paginatedProducts.length > 0 ? (
                paginatedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    addToCart={addToCart}
                  />
                ))
              ) : (
                <p style={{ padding: "20px", fontSize: "18px" }}>
                  Not available
                </p>
              )}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    className={currentPage === i + 1 ? "active" : ""}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Menu;
