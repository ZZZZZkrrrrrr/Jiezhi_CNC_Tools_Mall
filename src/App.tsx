import { useMemo, useState } from "react";
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  Search,
  ShoppingCart,
  UserRound,
  Globe2,
  ChevronRight,
  ShieldCheck,
  Headphones,
  Factory,
  SlidersHorizontal,
  Minus,
  Plus,
  Trash2,
  Heart,
  PackageCheck,
  FileText,
  MapPin,
  Clock3,
  CheckCircle2,
  X,
} from "lucide-react";
import { categories, products, getProduct, Product } from "./data/products";
import s from "./App.module.scss";

const toolIcon = (color = "#587181") => (
  <svg viewBox="0 0 120 120" aria-hidden="true">
    <defs>
      <linearGradient
        id={`g${color.replace("#", "")}`}
        x1="0"
        y1="0"
        x2="1"
        y2="1"
      >
        <stop stopColor="#f4f7f8" />
        <stop offset=".5" stopColor={color} />
        <stop offset="1" stopColor="#223541" />
      </linearGradient>
    </defs>
    <path
      d="M18 73 66 25l21 8 16 31-46 31z"
      fill={`url(#g${color.replace("#", "")})`}
    />
    <path d="m18 73 39 22 46-31-38-13z" fill="#b8c4cc" />
    <circle
      cx="69"
      cy="59"
      r="10"
      fill="#f6f8f9"
      stroke="#304653"
      strokeWidth="5"
    />
    <path d="M89 37 105 6l8 3-10 55z" fill="#d8a43b" />
  </svg>
);
const money = (n: number, usd: boolean) =>
  usd ? `$${(n / 7.15).toFixed(2)}` : `¥${n.toFixed(2)}`;

function App() {
  const [cart, setCart] = useState<Record<string, number>>(() =>
    JSON.parse(localStorage.getItem("pt-cart") || "{}"),
  );
  const [usd, setUsd] = useState(false);
  const [lang, setLang] = useState(false);
  const [toast, setToast] = useState("");
  const add = (id: string, q = 1) => {
    const next = { ...cart, [id]: (cart[id] || 0) + q };
    setCart(next);
    localStorage.setItem("pt-cart", JSON.stringify(next));
    setToast("已加入采购车");
    setTimeout(() => setToast(""), 2200);
  };
  return (
    <div>
      <Header
        count={Object.values(cart).reduce((a, b) => a + b, 0)}
        usd={usd}
        setUsd={setUsd}
        lang={lang}
        setLang={setLang}
      />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home add={add} usd={usd} />} />
          <Route path="/products" element={<Catalog add={add} usd={usd} />} />
          <Route path="/search" element={<Catalog add={add} usd={usd} />} />
          <Route path="/product/:id" element={<Detail add={add} usd={usd} />} />
          <Route
            path="/cart"
            element={<Cart cart={cart} setCart={setCart} usd={usd} />}
          />
          <Route path="/quote" element={<Quote cart={cart} />} />
          <Route path="/account/*" element={<Account />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <MobileNav count={Object.keys(cart).length} />
      {toast && (
        <div className={s.toast}>
          <CheckCircle2 /> {toast}
        </div>
      )}
    </div>
  );
}

function Header({
  count,
  usd,
  setUsd,
  lang,
  setLang,
}: {
  count: number;
  usd: boolean;
  setUsd: (v: boolean) => void;
  lang: boolean;
  setLang: (v: boolean) => void;
}) {
  const nav = useNavigate();
  const [q, setQ] = useState("");
  return (
    <>
      <a className={s.skip} href="#main">
        跳至主要内容
      </a>
      <div className={s.top}>
        <div>专注金属切削解决方案 · 企业采购支持</div>
        <div>
          <span>品质保障</span>
          <span>技术选型</span>
          <span>工作日 8:30–18:00</span>
        </div>
      </div>
      <header className={s.header}>
        <div className={s.headerInner}>
          <Link className={s.brand} to="/">
            <span className={s.mark}>PT</span>
            <span>
              <b>杰帜数控刀具</b>
              <small>PRECISION TOOLS</small>
            </span>
          </Link>
          <form
            className={s.search}
            onSubmit={(e) => {
              e.preventDefault();
              nav(`/search?q=${encodeURIComponent(q)}`);
            }}
          >
            <Search size={20} />
            <input
              aria-label="搜索商品"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="搜索型号、刀具名称、材质或品牌"
            />
            <button data-testid="global-search">搜索</button>
          </form>
          <div className={s.actions}>
            <button aria-label="切换语言" onClick={() => setLang(!lang)}>
              <Globe2 />
              {lang ? "EN" : "中"}
            </button>
            <button onClick={() => setUsd(!usd)}>{usd ? "USD" : "CNY"}</button>
            <Link to="/account">
              <UserRound />
              账户
            </Link>
            <Link className={s.cartLink} to="/cart">
              <ShoppingCart />
              采购车<i>{count}</i>
            </Link>
          </div>
        </div>
        <nav className={s.nav}>
          <Link to="/">首页</Link>
          <Link to="/products?tag=hot">热销刀具</Link>
          <Link to="/products?tag=new">新品专区</Link>
          <Link to="/quote">定制与询价</Link>
          <Link to="/account">企业服务</Link>
        </nav>
      </header>
    </>
  );
}

const ProductCard = ({
  p,
  add,
  usd,
}: {
  p: Product;
  add: (id: string) => void;
  usd: boolean;
}) => (
  <article className={s.productCard} data-testid={`product-${p.id}`}>
    <Link to={`/product/${p.id}`} className={s.productImg}>
      {p.tag && <span>{p.tag}</span>}
      {toolIcon(p.color)}
    </Link>
    <div className={s.productBody}>
      <small>{p.category}</small>
      <Link to={`/product/${p.id}`}>
        <h3>{p.name}</h3>
        <b className={s.model}>{p.model}</b>
      </Link>
      <dl>
        <div>
          <dt>规格</dt>
          <dd>{p.size}</dd>
        </div>
        <div>
          <dt>材质/涂层</dt>
          <dd>
            {p.material} · {p.coating}
          </dd>
        </div>
      </dl>
      <div className={s.stock}>
        <span>库存 {p.stock > 0 ? p.stock : "待确认"}</span>
        <span>{p.moq}件起订</span>
      </div>
      <div className={s.cardBottom}>
        <strong>
          {money(p.price, usd)}
          <small>/件</small>
        </strong>
        <button onClick={() => add(p.id)} aria-label={`加入采购车 ${p.model}`}>
          <Plus /> 加购
        </button>
      </div>
    </div>
  </article>
);

function Home({ add, usd }: { add: (id: string) => void; usd: boolean }) {
  return (
    <>
      <section className={s.hero}>
        <div className={s.heroInner}>
          <div>
            <span className={s.eyebrow}>
              PRECISION · RELIABILITY · EFFICIENCY
            </span>
            <h1>
              让每一次切削
              <br />
              <em>精准而高效</em>
            </h1>
            <p>
              覆盖车、铣、钻、螺纹加工的专业刀具供应平台。快速选型、透明库存、企业级询报价服务。
            </p>
            <div className={s.heroBtns}>
              <Link className={s.primary} to="/products">
                浏览全部刀具 <ChevronRight />
              </Link>
              <Link className={s.secondary} to="/quote">
                提交选型需求
              </Link>
            </div>
          </div>
          <div className={s.heroArt}>
            <div className={s.orbit} />
            {toolIcon("#587484")}
          </div>
        </div>
      </section>
      <section className={s.container}>
        <div className={s.sectionHead}>
          <div>
            <span>PRODUCT CATEGORIES</span>
            <h2>按加工工艺选刀具</h2>
          </div>
          <Link to="/products">
            查看全部分类 <ChevronRight />
          </Link>
        </div>
        <div className={s.categories}>
          {categories.map((c, i) => (
            <Link to={`/products?category=${c[0]}`} key={c[0]}>
              <span className={s.catIcon}>
                {toolIcon(
                  [
                    "#4d6978",
                    "#9c894e",
                    "#536f82",
                    "#647986",
                    "#c0a14d",
                    "#344c5c",
                  ][i],
                )}
              </span>
              <div>
                <b>{c[0]}</b>
                <small>{c[1]}</small>
              </div>
              <ChevronRight />
            </Link>
          ))}
        </div>
      </section>
      <section className={s.darkBand}>
        <div className={s.container}>
          <div className={s.sectionHead}>
            <div>
              <span>ENGINEER'S SELECTION</span>
              <h2>工程师严选</h2>
            </div>
            <Link to="/products">
              更多产品 <ChevronRight />
            </Link>
          </div>
          <div className={s.productGrid}>
            {products.slice(0, 4).map((p) => (
              <ProductCard key={p.id} p={p} add={add} usd={usd} />
            ))}
          </div>
        </div>
      </section>
      <section className={`${s.container} ${s.services}`}>
        <div>
          <ShieldCheck />
          <b>原厂品质保障</b>
          <span>严格供应商准入与批次追溯</span>
        </div>
        <div>
          <Factory />
          <b>企业批量采购</b>
          <span>阶梯价格与专属合同支持</span>
        </div>
        <div>
          <PackageCheck />
          <b>稳定库存交付</b>
          <span>常用型号现货快速出库</span>
        </div>
        <div>
          <Headphones />
          <b>应用技术支持</b>
          <span>工程师协助选型与参数建议</span>
        </div>
      </section>
    </>
  );
}

function Catalog({ add, usd }: { add: (id: string) => void; usd: boolean }) {
  const [sp] = useSearchParams();
  const [q, setQ] = useState(sp.get("q") || "");
  const [cat, setCat] = useState(sp.get("category") || "全部刀具");
  const [material, setMaterial] = useState("全部");
  const [sort, setSort] = useState("综合排序");
  const [showFilters, setShowFilters] = useState(false);
  const list = useMemo(
    () =>
      products
        .filter(
          (p) =>
            ((cat === "全部刀具" || p.category === cat) &&
              material === "全部") ||
            false,
        )
        .filter((p) => material === "全部" || p.material === material)
        .filter(
          (p) =>
            !q ||
            `${p.name}${p.model}${p.material}`
              .toLowerCase()
              .includes(q.toLowerCase()),
        )
        .sort((a, b) =>
          sort === "价格从低到高"
            ? a.price - b.price
            : sort === "库存优先"
              ? b.stock - a.stock
              : 0,
        ),
    [q, cat, material, sort],
  );
  return (
    <div className={s.catalogWrap}>
      <div className={s.breadcrumb}>
        首页 <ChevronRight /> 商品中心
      </div>
      <div className={s.catalogHeader}>
        <div>
          <span>PRECISION TOOLING</span>
          <h1>精密刀具产品中心</h1>
          <p>按工艺、材质与规格快速定位适合的切削方案</p>
        </div>
        <div className={s.catalogSearch}>
          <Search />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="在结果中搜索型号"
          />
        </div>
      </div>
      <div className={s.catalogLayout}>
        <aside className={`${s.filters} ${showFilters ? s.open : ""}`}>
          <button
            className={s.filterClose}
            onClick={() => setShowFilters(false)}
          >
            <X />
            关闭
          </button>
          <h2>产品分类</h2>
          {["全部刀具", ...categories.map((c) => c[0])].map((c) => (
            <button
              className={cat === c ? s.active : ""}
              onClick={() => setCat(c)}
              key={c}
            >
              {c}
              <span>
                {c === "全部刀具"
                  ? products.length
                  : products.filter((p) => p.category === c).length}
              </span>
            </button>
          ))}
          <h2>刀具材质</h2>
          {["全部", "硬质合金", "高速钢", "CBN", "合金钢"].map((m) => (
            <label key={m}>
              <input
                type="radio"
                name="material"
                checked={material === m}
                onChange={() => setMaterial(m)}
              />
              {m}
            </label>
          ))}
          <h2>精度等级</h2>
          {["普通级", "精密级", "超精密级"].map((m) => (
            <label key={m}>
              <input type="checkbox" />
              {m}
            </label>
          ))}
        </aside>
        <section className={s.results}>
          <div className={s.resultBar}>
            <span>
              共找到 <b>{list.length}</b> 件商品
            </span>
            <button
              className={s.mobileFilter}
              onClick={() => setShowFilters(true)}
            >
              <SlidersHorizontal />
              筛选
            </button>
            <select
              aria-label="商品排序"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option>综合排序</option>
              <option>价格从低到高</option>
              <option>库存优先</option>
            </select>
          </div>
          {list.length ? (
            <div className={s.productGrid}>
              {list.map((p) => (
                <ProductCard p={p} key={p.id} add={add} usd={usd} />
              ))}
            </div>
          ) : (
            <div className={s.empty}>
              <Search />
              <h2>没有找到匹配商品</h2>
              <p>请尝试缩短型号或清除筛选条件</p>
              <button
                onClick={() => {
                  setQ("");
                  setCat("全部刀具");
                  setMaterial("全部");
                }}
              >
                重置筛选
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function Detail({
  add,
  usd,
}: {
  add: (id: string, q?: number) => void;
  usd: boolean;
}) {
  const { id } = useParams();
  const p = getProduct(id);
  const [qty, setQty] = useState(p.moq);
  const [liked, setLiked] = useState(false);
  const [tab, setTab] = useState("规格参数");
  return (
    <div className={s.detail}>
      <div className={s.breadcrumb}>
        首页 <ChevronRight /> {p.category} <ChevronRight /> {p.model}
      </div>
      <section className={s.detailTop}>
        <div className={s.gallery}>
          <div className={s.mainImage}>
            {p.tag && <span>{p.tag}</span>}
            {toolIcon(p.color)}
          </div>
          <div className={s.thumbs}>
            {[1, 2, 3, 4].map((n) => (
              <button key={n}>{toolIcon(n % 2 ? p.color : "#8da0ac")}</button>
            ))}
          </div>
        </div>
        <div className={s.info}>
          <span className={s.productType}>{p.category} · 精密级</span>
          <h1>{p.name}</h1>
          <div className={s.modelRow}>
            <b>{p.model}</b>
            <button onClick={() => setLiked(!liked)} aria-pressed={liked}>
              <Heart fill={liked ? "currentColor" : "none"} />{" "}
              {liked ? "已收藏" : "收藏"}
            </button>
          </div>
          <p className={s.lead}>
            高稳定性精密切削刀具，适用于连续及断续加工。以下技术参数为原型演示数据，下单前请与工程师确认。
          </p>
          <div className={s.priceBox}>
            <span>企业采购价</span>
            <strong>{money(p.price, usd)}</strong>
            <small>含税参考价 · 批量采购享阶梯优惠</small>
          </div>
          <dl className={s.keySpecs}>
            <div>
              <dt>库存状态</dt>
              <dd className={s.green}>现货 {p.stock} 件</dd>
            </div>
            <div>
              <dt>起订数量</dt>
              <dd>{p.moq} 件</dd>
            </div>
            <div>
              <dt>预计发货</dt>
              <dd>付款后 1–3 个工作日</dd>
            </div>
            <div>
              <dt>发货仓</dt>
              <dd>华东中心仓</dd>
            </div>
          </dl>
          <div className={s.option}>
            <b>规格选择</b>
            <div>
              <button className={s.selected}>{p.size}</button>
              <button>同系列其他规格</button>
            </div>
          </div>
          <div className={s.buyRow}>
            <div className={s.stepper}>
              <button onClick={() => setQty(Math.max(p.moq, qty - 1))}>
                <Minus />
              </button>
              <input
                aria-label="采购数量"
                type="number"
                value={qty}
                onChange={(e) => setQty(Math.max(p.moq, +e.target.value))}
              />
              <button onClick={() => setQty(qty + 1)}>
                <Plus />
              </button>
            </div>
            <button className={s.addCart} onClick={() => add(p.id, qty)}>
              <ShoppingCart />
              加入采购车
            </button>
            <Link className={s.quoteBtn} to={`/quote?product=${p.id}`}>
              立即询价
            </Link>
          </div>
          <div className={s.assurances}>
            <span>
              <ShieldCheck />
              正品保障
            </span>
            <span>
              <PackageCheck />
              批次可追溯
            </span>
            <span>
              <Headphones />
              工程师支持
            </span>
          </div>
        </div>
      </section>
      <section className={s.specSection}>
        <div className={s.tabs}>
          {["规格参数", "应用说明", "交付与服务"].map((t) => (
            <button
              className={tab === t ? s.active : ""}
              onClick={() => setTab(t)}
              key={t}
            >
              {t}
            </button>
          ))}
        </div>
        {tab === "规格参数" ? (
          <div className={s.specContent}>
            <h2>技术规格参数</h2>
            <div className={s.specGrid}>
              {[
                ["产品型号", p.model],
                ["刀具材质", p.material],
                ["涂层类型", p.coating],
                ["主要规格", p.size],
                ["精度等级", "精密级"],
                ["适用材料", "ISO P / M / K"],
                ["适用机床", "加工中心、数控铣床"],
                ["包装规格", `${p.moq} 件/盒`],
              ].map((x) => (
                <div key={x[0]}>
                  <b>{x[0]}</b>
                  <span>{x[1]}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className={s.specContent}>
            <h2>{tab}</h2>
            <p>
              适合结构钢、不锈钢及铸铁的稳定加工。建议根据机床刚性、工件材料和冷却条件，由应用工程师确认切削参数。
            </p>
          </div>
        )}
      </section>
      <section className={s.related}>
        <div className={s.sectionHead}>
          <div>
            <span>RELATED PRODUCTS</span>
            <h2>同系列推荐</h2>
          </div>
        </div>
        <div className={s.productGrid}>
          {products.slice(8, 12).map((x) => (
            <ProductCard p={x} add={add} usd={usd} key={x.id} />
          ))}
        </div>
      </section>
    </div>
  );
}

function Cart({
  cart,
  setCart,
  usd,
}: {
  cart: Record<string, number>;
  setCart: (v: Record<string, number>) => void;
  usd: boolean;
}) {
  const items = Object.entries(cart).map(([id, q]) => ({
    p: getProduct(id),
    q,
  }));
  const update = (id: string, q: number) => {
    const n = { ...cart };
    q <= 0 ? delete n[id] : (n[id] = q);
    setCart(n);
    localStorage.setItem("pt-cart", JSON.stringify(n));
  };
  const total = items.reduce((n, x) => n + x.p.price * x.q, 0);
  return (
    <div className={s.page}>
      <div className={s.pageTitle}>
        <div>
          <span>PURCHASE CART</span>
          <h1>采购车</h1>
        </div>
        <small>{items.length} 种商品</small>
      </div>
      {items.length ? (
        <div className={s.cartLayout}>
          <section className={s.cartPanel}>
            {items.map(({ p, q }) => (
              <div className={s.cartItem} key={p.id}>
                <div className={s.cartPic}>{toolIcon(p.color)}</div>
                <div className={s.cartDesc}>
                  <Link to={`/product/${p.id}`}>
                    <b>{p.name}</b>
                    <strong>{p.model}</strong>
                  </Link>
                  <span>
                    {p.size} · {p.material} · {p.coating}
                  </span>
                  <small>
                    起订量 {p.moq} 件 · 库存 {p.stock} 件
                  </small>
                </div>
                <div className={s.stepper}>
                  <button onClick={() => update(p.id, q - 1)}>
                    <Minus />
                  </button>
                  <input
                    value={q}
                    onChange={(e) => update(p.id, +e.target.value)}
                  />
                  <button onClick={() => update(p.id, q + 1)}>
                    <Plus />
                  </button>
                </div>
                <strong>{money(p.price * q, usd)}</strong>
                <button
                  className={s.delete}
                  onClick={() => update(p.id, 0)}
                  aria-label="删除商品"
                >
                  <Trash2 />
                </button>
              </div>
            ))}
          </section>
          <aside className={s.summary}>
            <h2>采购汇总</h2>
            <div>
              <span>商品种类</span>
              <b>{items.length} 种</b>
            </div>
            <div>
              <span>商品数量</span>
              <b>{items.reduce((n, x) => n + x.q, 0)} 件</b>
            </div>
            <div className={s.total}>
              <span>参考合计</span>
              <strong>{money(total, usd)}</strong>
            </div>
            <p>最终价格、税费及交期以正式报价单为准</p>
            <Link className={s.primary} to="/quote">
              去提交询价 <ChevronRight />
            </Link>
          </aside>
        </div>
      ) : (
        <div className={s.empty}>
          <ShoppingCart />
          <h2>采购车还是空的</h2>
          <p>添加常用刀具，统一询价更高效</p>
          <Link to="/products">去选购刀具</Link>
        </div>
      )}
    </div>
  );
}

function Quote({ cart }: { cart: Record<string, number> }) {
  const [done, setDone] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setDone(true);
  };
  return (
    <div className={s.page}>
      <div className={s.pageTitle}>
        <div>
          <span>REQUEST FOR QUOTATION</span>
          <h1>提交企业询价</h1>
        </div>
        <small>通常 24 小时内反馈</small>
      </div>
      {done ? (
        <div className={s.success}>
          <CheckCircle2 />
          <h2>询价单提交成功</h2>
          <p>演示编号 RFQ-20260721-0086，应用工程师将尽快联系您。</p>
          <Link to="/">返回首页</Link>
        </div>
      ) : (
        <form className={s.quoteForm} onSubmit={submit}>
          <section>
            <h2>
              <span>01</span>企业与联系人
            </h2>
            <div className={s.formGrid}>
              <label>
                公司名称 *<input required placeholder="请输入完整公司名称" />
              </label>
              <label>
                联系人 *<input required placeholder="姓名" />
              </label>
              <label>
                联系电话 *
                <input
                  required
                  type="tel"
                  pattern="[0-9-]{7,}"
                  placeholder="手机或座机"
                />
              </label>
              <label>
                电子邮箱
                <input type="email" placeholder="用于接收报价单" />
              </label>
              <label className={s.full}>
                收货地区 *
                <input required placeholder="省 / 市 / 区 / 详细地址" />
              </label>
            </div>
          </section>
          <section>
            <h2>
              <span>02</span>采购需求
            </h2>
            <div className={s.rfqList}>
              {Object.keys(cart).length ? (
                Object.entries(cart).map(([id, q]) => (
                  <div key={id}>
                    <b>{getProduct(id).model}</b>
                    <span>{getProduct(id).name}</span>
                    <strong>{q} 件</strong>
                  </div>
                ))
              ) : (
                <div>
                  <b>自定义刀具需求</b>
                  <span>请在下方说明型号、尺寸与加工条件</span>
                </div>
              )}
            </div>
            <label>
              需求说明
              <textarea
                rows={5}
                placeholder="请描述加工材料、机床、尺寸、公差、预计用量或交期要求"
              />
            </label>
          </section>
          <section>
            <h2>
              <span>03</span>发票与贸易信息
            </h2>
            <div className={s.formGrid}>
              <label>
                发票类型
                <select>
                  <option>增值税专用发票</option>
                  <option>增值税普通发票</option>
                </select>
              </label>
              <label>
                结算币种
                <select>
                  <option>人民币 CNY</option>
                  <option>美元 USD（预留）</option>
                </select>
              </label>
              <label className={s.full}>
                国际物流信息（选填）
                <input placeholder="Country / ZIP / Incoterms" />
              </label>
            </div>
          </section>
          <button className={s.submit} type="submit">
            提交询价单
          </button>
        </form>
      )}
    </div>
  );
}

function Account() {
  return (
    <div className={s.page}>
      <div className={s.accountHero}>
        <div className={s.avatar}>
          <UserRound />
        </div>
        <div>
          <small>企业采购账户</small>
          <h1>下午好，采购负责人</h1>
          <p>完成企业认证后可申请专属价格与账期</p>
        </div>
        <button>立即认证</button>
      </div>
      <div className={s.accountGrid}>
        {[
          [FileText, "我的询价单", "3 条处理中"],
          [PackageCheck, "订单管理", "查看采购订单"],
          [Heart, "我的收藏", "12 件刀具"],
          [Clock3, "浏览记录", "最近查看"],
          [MapPin, "地址管理", "2 个收货地址"],
          [ShieldCheck, "企业资质", "待完善"],
        ].map(([I, t, d]) => (
          <Link to="#" key={t as string}>
            <I />
            <div>
              <b>{t as string}</b>
              <span>{d as string}</span>
            </div>
            <ChevronRight />
          </Link>
        ))}
      </div>
      <section className={s.contactCard}>
        <div>
          <span>TECHNICAL SUPPORT</span>
          <h2>需要选型或工艺支持？</h2>
          <p>提交加工材料、机床和目标参数，应用工程师将为您提供建议。</p>
        </div>
        <Link to="/quote">联系技术顾问</Link>
      </section>
    </div>
  );
}
function NotFound() {
  return (
    <div className={s.empty}>
      <h1>404</h1>
      <h2>页面不存在</h2>
      <Link to="/">返回首页</Link>
    </div>
  );
}
function Footer() {
  return (
    <footer className={s.footer}>
      <div>
        <Link className={s.brand} to="/">
          <span className={s.mark}>PT</span>
          <span>
            <b>杰帜数控刀具</b>
            <small>PRECISION TOOLS</small>
          </span>
        </Link>
        <p>为制造企业提供可靠、高效的精密切削工具与应用服务。</p>
      </div>
      <div>
        <b>产品中心</b>
        <Link to="/products">车削刀具</Link>
        <Link to="/products">铣削刀具</Link>
        <Link to="/products">孔加工刀具</Link>
      </div>
      <div>
        <b>企业服务</b>
        <Link to="/quote">批量询价</Link>
        <Link to="/account">资质认证</Link>
        <Link to="/account">售后支持</Link>
      </div>
      <div>
        <b>联系我们</b>
        <span>400-860-8816</span>
        <span>service@precision-demo.cn</span>
        <span>周一至周六 8:30–18:00</span>
      </div>
      <small>© 2026 杰帜数控刀具 · 高保真交互原型（演示数据）</small>
    </footer>
  );
}
function MobileNav({ count }: { count: number }) {
  return (
    <nav className={s.mobileNav}>
      <Link to="/">首页</Link>
      <Link to="/products">分类</Link>
      <Link to="/cart">采购车 {count > 0 && <i>{count}</i>}</Link>
      <Link to="/account">我的</Link>
    </nav>
  );
}
export default App;
