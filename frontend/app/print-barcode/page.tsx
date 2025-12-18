"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { ArrowLeft, Printer, Box } from "lucide-react";
// In a real app, you would install a library like 'jsbarcode'
// e.g., npm install jsbarcode
// import JsBarcode from 'jsbarcode';

// Framer motion variants
const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      type: "spring",
      stiffness: 120,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export default function PrintBarcodePage() {
  const [productName, setProductName] = useState("Server Rack Mount 42U");
  const [sku, setSku] = useState("IT42URM12345"); // Standard SKU/UPC format
  const [quantity, setQuantity] = useState(10);
  const printAreaRef = useRef<HTMLDivElement>(null);

  // Helper function to generate an array of numbers for mapping
  const generateLabels = (count: number) =>
    Array.from({ length: count }, (_, i) => i);

  const handlePrint = () => {
    // Add print specific CSS here to only print the desired section
    const printContents = printAreaRef.current?.innerHTML;
    const originalContents = document.body.innerHTML;

    if (printContents) {
      // A simple way to manage print styles: swap body content
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      // Reloading might be necessary if state/event listeners break after body swap
      window.location.reload();
    } else {
      window.print();
    }
  };

  // MOCK: In a real app, use useEffect to run JsBarcode after component mounts/updates
  /* 
  useEffect(() => {
    if (printAreaRef.current) {
        const barcodes = printAreaRef.current.querySelectorAll('.barcode-item');
        barcodes.forEach(element => {
            JsBarcode(element, sku, {
                format: "CODE128",
                displayValue: true,
                fontSize: 14,
                textMargin: 0,
                width: 1.5,
                height: 50,
            });
        });
    }
  }, [sku, quantity]);
  */

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 selection:bg-blue-200">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/10 via-white/50 to-cyan-500/10 backdrop-blur-3xl pointer-events-none print:hidden"></div>

      <div className="max-w-6xl mx-auto relative print:hidden">
        <header className="flex justify-between items-center mb-6">
          <Link
            href="/products" // Adjust link as needed
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors group font-semibold text-sm"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Product
          </Link>
          <button
            onClick={handlePrint}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg hover:shadow-green-500/50"
          >
            <Printer size={20} />
            Print Labels
          </button>
        </header>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Control Panel Card */}
          <div className="lg:col-span-1 bg-white/50 backdrop-blur-2xl border border-white/60 rounded-3xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Print Controls
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full bg-white/90 border border-white/80 rounded-lg p-2 text-sm shadow-inner"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  SKU / Barcode Data
                </label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full bg-white/90 border border-white/80 rounded-lg p-2 text-sm shadow-inner"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quantity to Print
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full bg-white/90 border border-white/80 rounded-lg p-2 text-sm shadow-inner"
                />
              </div>
            </form>
          </div>

          {/* Preview Area Card */}
          <div className="lg:col-span-2 bg-white/50 backdrop-blur-2xl border border-white/60 rounded-3xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Print Preview
            </h2>

            {/* This div is referenced for printing */}
            <div ref={printAreaRef} className="p-4 bg-white/80 rounded-lg">
              <style>{`
                        @media print {
                            body {
                                background-color: #fff;
                                print-color-adjust: exact;
                            }
                            .barcode-label {
                                page-break-inside: avoid;
                                margin: 5mm; /* Standard label margin */
                                text-align: center;
                                padding: 5px;
                                border: 1px solid #eee;
                                border-radius: 5px;
                                display: inline-block;
                                width: 50mm; /* Standard label width */
                            }
                            .barcode-name {
                                font-size: 10px;
                                font-weight: bold;
                                margin-bottom: 5px;
                            }
                            .barcode-sku {
                                font-size: 8px;
                                color: #555;
                                margin-top: 2px;
                            }
                        }
                    `}</style>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {generateLabels(quantity).map((index) => (
                  <div key={index} className="barcode-label">
                    <div className="barcode-name">
                      {productName.substring(0, 25)}
                    </div>
                    {/* The SVG will be injected here by JsBarcode library script when run */}
                    {/* Using a placeholder SVG for visual representation in React */}
                    <svg
                      className="barcode-item mx-auto"
                      data-value={sku}
                      style={{
                        width: "100%",
                        maxWidth: "150px",
                        height: "50px",
                      }}
                      // MOCK SVG path for demonstration
                      dangerouslySetInnerHTML={{
                        __html: `<rect fill="black" x="0" y="0" width="1.5" height="50""")/>><rect fill="black" x="4" y="0" width="1.5" height="50""")/>><rect fill="black" x="7" y="0" width="4.5" height="50""")/>><rect fill="black" x="14" y="0" width="1.5" height="50""")/>><rect fill="black" x="18" y="0" width="1.5" height="50""")/>><rect fill="black" x="22" y="0" width="1.5" height="50""")/>><rect fill="black" x="25" y="0" width="1.5" height="50""")/>><rect fill="black" x="29" y="0" width="4.5" height="50""")/>><rect fill="black" x="35" y="0" width="1.5" height="50""")/>>`,
                      }}
                    ></svg>
                    <div className="barcode-sku">{sku}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
