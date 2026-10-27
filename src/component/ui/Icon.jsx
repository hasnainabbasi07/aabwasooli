const Svg = ({ children, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

export const EllipsisIcon = () => (
  <Svg size={18}>
    <circle cx="5" cy="12" r="1.3" fill="currentColor" />
    <circle cx="12" cy="12" r="1.3" fill="currentColor" />
    <circle cx="19" cy="12" r="1.3" fill="currentColor" />
  </Svg>
);

export const EditIcon = () => (
  <Svg>
    <path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z" />
    <path d="m13.5 6.5 4 4" />
  </Svg>
);

export const AmountIcon = () => (
  <Svg>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v10M9.5 9.5C9.5 8.4 10.6 8 12 8s2.5.5 2.5 1.6-1 1.5-2.5 1.9-2.5.8-2.5 2 1.1 1.6 2.5 1.6 2.5-.5 2.5-1.6" />
  </Svg>
);

export const TrashIcon = () => (
  <Svg>
    <path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6m4 4v6m6-6v6" />
  </Svg>
);

export const InvoiceIcon = () => (
  <Svg>
    <path d="M6 3h9l4 4v14H6zM14 3v5h5M9 12h7M9 16h7" />
  </Svg>
);

export const DownloadIcon = () => (
  <Svg>
    <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v4h16v-4" />
  </Svg>
);

export const PrinterIcon = () => (
  <Svg>
    <path d="M7 8V3h10v5M7 17H4V9h16v8h-3M7 14h10v7H7zM17 11h.01" />
  </Svg>
);

export const EyeIcon = () => (
  <Svg>
    <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
    <circle cx="12" cy="12" r="2.5" />
  </Svg>
);

export const EyeOffIcon = () => (
  <Svg>
    <path d="m3 3 18 18M10.6 6.2A10.8 10.8 0 0 1 12 6c6.5 0 10 6 10 6a16.6 16.6 0 0 1-3.2 3.7M6.2 6.2C3.5 8 2 12 2 12s3.5 6 10 6c1.5 0 2.8-.3 4-.8" />
    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
  </Svg>
);

export const HistoryIcon = () => (
  <Svg>
    <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l3 2" />
  </Svg>
);

export const ReturnIcon = () => (
  <Svg>
    <path d="M9 14 4 9l5-5" />
    <path d="M4 9h9a7 7 0 0 1 0 14h-2" />
  </Svg>
);

export const UserCheckIcon = () => (
  <Svg>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20c0-3.6 3-6 6.5-6s6.5 2.4 6.5 6" />
    <path d="m16.5 11 2 2 3.5-4" />
  </Svg>
);

export const UserOffIcon = () => (
  <Svg>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20c0-3.6 3-6 6.5-6s6.5 2.4 6.5 6" />
    <path d="m17 8 5 5M22 8l-5 5" />
  </Svg>
);

export const ChevronRightIcon = () => (
  <Svg size={14}>
    <path d="m9 6 6 6-6 6" />
  </Svg>
);

export const ChevronLeftIcon = () => (
  <Svg size={14}>
    <path d="m15 6-6 6 6 6" />
  </Svg>
);

export const DoubleChevronRightIcon = () => (
  <Svg size={14}>
    <path d="m6 6 6 6-6 6M13 6l6 6-6 6" />
  </Svg>
);

export const DoubleChevronLeftIcon = () => (
  <Svg size={14}>
    <path d="m18 6-6 6 6 6M11 6l-6 6 6 6" />
  </Svg>
);

export const PlusIcon = () => (
  <Svg size={14}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);

export const MinusIcon = () => (
  <Svg size={14}>
    <path d="M5 12h14" />
  </Svg>
);

export const TruckIcon = () => (
  <Svg size={16}>
    <path d="M10 17h4V5H2v12h3" />
    <path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L18 8h-4v9h2" />
    <circle cx="7.5" cy="17.5" r="2.5" />
    <circle cx="17.5" cy="17.5" r="2.5" />
  </Svg>
);

export const BottleIcon = () => (
  <Svg size={16}>
    <path d="M9 2h6v3H9zM10 5v3a4 4 0 0 1-2 3.46V20a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-8.54A4 4 0 0 1 14 8V5" />
  </Svg>
);



export const SendIcon = ({ size = 16 }) => (
  <Svg size={size}>
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </Svg>
);

export const ResendIcon = ({ size = 16 }) => (
  <Svg size={size}>
    <polyline points="23 4 23 10 17 10" />
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </Svg>
);

export const CheckCircleIcon = ({ size = 18, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export const WhatsAppIcon = ({ size = 18, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.11 6.88C8.95 6.88 8.68 6.94 8.46 7.18C8.24 7.42 7.62 8 7.62 9.22C7.62 10.44 8.51 11.62 8.63 11.78C8.75 11.95 10.35 14.42 12.8 15.48C13.39 15.73 13.84 15.88 14.2 16C14.79 16.18 15.33 16.16 15.75 16.1C16.23 16.03 17.21 15.5 17.41 14.93C17.62 14.36 17.62 13.87 17.56 13.77C17.5 13.67 17.34 13.61 17.1 13.49C16.85 13.37 15.62 12.76 15.39 12.68C15.16 12.6 15 12.55 14.83 12.8C14.67 13.04 14.2 13.61 14.06 13.77C13.92 13.93 13.78 13.95 13.53 13.83C13.29 13.71 12.5 13.45 11.56 12.61C10.83 11.96 10.34 11.16 10.2 10.91C10.06 10.67 10.18 10.54 10.31 10.42C10.42 10.31 10.56 10.13 10.68 9.99C10.8 9.85 10.84 9.75 10.92 9.58C11 9.42 10.96 9.28 10.9 9.16C10.84 9.04 10.37 7.89 10.18 7.42C9.99 6.96 9.8 7.02 9.66 7.02C9.53 7.01 9.37 7.01 9.21 7.01L9.11 6.88Z" />
  </svg>
);

export const BuildingIcon = ({ size = 18 }) => (
  <Svg size={size}>
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
    <path d="M9 22v-4h6v4" />
    <path d="M8 6h.01M16 6h.01M12 6h.01M8 10h.01M16 10h.01M12 10h.01M8 14h.01M16 14h.01M12 14h.01" />
  </Svg>
);

export const PhoneCallIcon = ({ size = 18 }) => (
  <Svg size={size}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </Svg>
);

export const XCircleIcon = ({ size = 18 }) => (
  <Svg size={size}>
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </Svg>
);

export const GaugeIcon = ({ size = 18 }) => (
  <Svg size={size}>
    <path d="m12 14 4-4" />
    <path d="M3.34 19a10 10 0 1 1 17.32 0" />
  </Svg>
);

export const HourglassIcon = ({ size = 18 }) => (
  <Svg size={size}>
    <path d="M5 22h14" />
    <path d="M5 2h14" />
    <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
    <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
  </Svg>
);

export const HandGearIcon = ({ size = 40 }) => (
  <Svg size={size}>
    <circle cx="15" cy="7" r="3" />
    <circle cx="15" cy="7" r="1" />
    <path d="M15 2.4V4M15 10v1.6M10.4 7H12M18 7h1.6M12.9 4.9l-1.1-1.1M17.1 4.9l1.1-1.1M12.9 9.1l-1.1 1.1M17.1 9.1l1.1 1.1" />
    <path d="M2 15h3v7H2z" />
    <path d="M5 16.5l3-1 4.5.5a1.6 1.6 0 0 1 0 3.2H10M5 21l8 1 7-3 2-1.5a1.5 1.5 0 0 0-2-2L16 17.5" />
  </Svg>
);


