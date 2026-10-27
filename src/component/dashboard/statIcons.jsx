const Svg = ({ children }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

export const statIcons = {
  clients: (
    <Svg>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-3.6 3-6 6.5-6s6.5 2.4 6.5 6" />
      <circle cx="17.5" cy="9" r="2.5" />
      <path d="M17 14.5c2.6 0 4.5 1.7 4.5 4.5" />
    </Svg>
  ),
  delivery: (
    <Svg>
      <path d="M2 6h11v10H2z" />
      <path d="M13 9h4l3 3v4h-7z" />
      <circle cx="6.5" cy="17.5" r="1.8" />
      <circle cx="16.5" cy="17.5" r="1.8" />
    </Svg>
  ),
  orders: (
    <Svg>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 4V3h6v1M9 13l2 2 4-4" />
    </Svg>
  ),
  counter: (
    <Svg>
      <path d="M3 4h2l2.5 11h10L20 8H6.5" />
      <circle cx="9" cy="19" r="1.5" />
      <circle cx="17" cy="19" r="1.5" />
    </Svg>
  ),

  discount: (
    <Svg>
      <path d="M3 12V4h8l10 10-8 8z" />
      <circle cx="7.5" cy="8.5" r="1.3" />
    </Svg>
  ),
  received: (
    <Svg>
      <path d="M3 7a2 2 0 0 1 2-2h13v4M3 7v11a2 2 0 0 0 2 2h15V9H5a2 2 0 0 1-2-2z" />
      <path d="M16 14.5h.01" />
    </Svg>
  ),
  defaulters: (
    <Svg>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-3.6 3-6 6.5-6s6.5 2.4 6.5 6" />
      <path d="M19 8v5M19 16.5h.01" />
    </Svg>
  ),
  receivable: (
    <Svg>
      <path d="M3 7a2 2 0 0 1 2-2h13v4M3 7v11a2 2 0 0 0 2 2h15V9H5a2 2 0 0 1-2-2z" />
      <path d="M12 12v4m0 0-2-2m2 2 2-2" />
    </Svg>
  ),
  advance: (
    <Svg>
      <path d="M3 7a2 2 0 0 1 2-2h13v4M3 7v11a2 2 0 0 0 2 2h15V9H5a2 2 0 0 1-2-2z" />
      <path d="M12 12v4M10 14h4" />
    </Svg>
  ),

  newClient: (
    <Svg>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-3.6 3-6 6.5-6s6.5 2.4 6.5 6" />
      <path d="M19 8v6M16 11h6" />
    </Svg>
  ),
  deposit: (
    <Svg>
      <path d="M12 3l8 3v6c0 4.5-3.2 7.8-8 9-4.8-1.2-8-4.5-8-9V6z" />
      <path d="M9 12l2 2 4-4" />
    </Svg>
  ),
  bottle: (
    <Svg>
      <path d="M9 3h6M10 3v3l-2 2v11a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V8l-2-2V3" />
      <path d="M8 13h8" />
    </Svg>
  ),

  todayDelivery: (
    <Svg>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4M9 15l2 2 4-4" />
    </Svg>
  ),
  balance: (
    <Svg>
      <path d="M12 4v16M6 20h12M5 7h14" />
      <path d="M5 7l-3 6a3 3 0 0 0 6 0zM19 7l-3 6a3 3 0 0 0 6 0z" />
    </Svg>
  ),
  collection: (
    <Svg>
      <circle cx="9" cy="9" r="5" />
      <path d="M9 7v4M7.5 9h3M19 11a5 5 0 0 1-5 7" />
    </Svg>
  ),

  depositUsers: (
    <Svg>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-3.6 3-6 6.5-6s6.5 2.4 6.5 6" />
      <path d="M19 6l3 1v3c0 2-1.3 3.5-3 4-1.7-.5-3-2-3-4V7z" />
    </Svg>
  ),
  securityDeposit: (
    <Svg>
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14.5v2.5" />
    </Svg>
  ),
  bottleDeposit: (
    <Svg>
      <path d="M9 3h6M10 3v3l-2 2v11a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V8l-2-2V3" />
      <path d="M12 11v5m0 0-2-2m2 2 2-2" />
    </Svg>
  ),

  bottleUsers: (
    <Svg>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-3.6 3-6 6.5-6s6.5 2.4 6.5 6" />
      <path d="M19 4h2M19.5 4v2l-1 1v6a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V7l-1-1V4" />
    </Svg>
  ),
  clientBottle: (
    <Svg>
      <path d="M9 3h6M10 3v3l-2 2v11a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V8l-2-2V3" />
      <circle cx="12" cy="14" r="2" />
    </Svg>
  ),
  companyBottle: (
    <Svg>
      <path d="M3 21V9l6-3v15M9 21V4l6 3v14M15 21V11l6-2v12M2 21h20" />
    </Svg>
  ),
  saleCount: (
    <Svg>
      <path d="M3 4h2l2.5 11h10L20 8H6.5" />
      <circle cx="9" cy="19" r="1.5" />
      <circle cx="17" cy="19" r="1.5" />
      <path d="M10 10h6" />
    </Svg>
  ),
  salePaid: (
    <Svg>
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 10h18M8 15l2 2 4-4" />
    </Svg>
  ),
  saleTotal: (
    <Svg>
      <path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" />
      <path d="M9 8h6M9 12h6" />
    </Svg>
  ),

  weekClients: (
    <Svg>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-3.6 3-6 6.5-6s6.5 2.4 6.5 6" />
      <rect x="15" y="4" width="7" height="7" rx="1.5" />
      <path d="M15 7h7M18.5 4v-1" />
    </Svg>
  ),
  weekDelivery: (
    <Svg>
      <path d="M2 6h11v10H2z" />
      <path d="M13 9h4l3 3v4h-7z" />
      <circle cx="6.5" cy="17.5" r="1.8" />
      <circle cx="16.5" cy="17.5" r="1.8" />
      <path d="M5 9.5h5" />
    </Svg>
  ),
  weekSale: (
    <Svg>
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
    </Svg>
  ),
  weekReceived: (
    <Svg>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.5l3 3 5-6" />
    </Svg>
  ),
  deletedUsers: (
    <Svg>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-3.6 3-6 6.5-6s6.5 2.4 6.5 6" />
      <path d="M16.5 6.5l5 5M21.5 6.5l-5 5" />
    </Svg>
  ),
  deletedAmount: (
    <Svg>
      <path d="M4 7h16M10 7V4h4v3M6 7l1 13h10l1-13" />
      <path d="M10 11v6M14 11v6" />
    </Svg>
  ),

  discountCount: (
    <Svg>
      <path d="M3 12V4h8l10 10-8 8z" />
      <circle cx="7.5" cy="8.5" r="1.3" />
      <path d="M12 12l3 3" />
    </Svg>
  ),
  discountAmount: (
    <Svg>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M6.5 9.5h.01M17.5 14.5h.01" />
    </Svg>
  ),
  discountTotal: (
    <Svg>
      <path d="M19 5L5 19" />
      <circle cx="7" cy="7" r="2.5" />
      <circle cx="17" cy="17" r="2.5" />
    </Svg>
  ),

  unpaid: (
    <Svg>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M12 8v5M12 16.5h.01" />
    </Svg>
  ),
  unpaidAmount: (
    <Svg>
      <path d="M3 7a2 2 0 0 1 2-2h13v4M3 7v11a2 2 0 0 0 2 2h15V9H5a2 2 0 0 1-2-2z" />
      <path d="m10.5 12 3 3m0-3-3 3" />
    </Svg>
  ),
};
