export function InvoiceMock() {
  return (
    <div className="landing-browser-frame">
      <div className="landing-browser-card">
        <div className="landing-browser-chrome">
          <span className="landing-browser-dot" />
          <span className="landing-browser-dot" />
          <span className="landing-browser-dot" />
        </div>
        <div className="landing-mock-invoice">
          <div className="landing-mock-header">
            <div>
              <div className="landing-mock-company">Acme Studio</div>
              <div className="landing-mock-tagline">Design &amp; Development</div>
            </div>
            <div className="text-right">
              <div className="landing-mock-invoice-title">Invoice</div>
              <div className="landing-mock-detail">#INV-042</div>
            </div>
          </div>

          <div className="landing-mock-divider" />

          <div className="landing-mock-meta-row">
            <div>
              <div className="landing-mock-label">Billed to</div>
              <div className="landing-mock-client">Maple &amp; Co.</div>
              <div className="landing-mock-detail">42 Orchard Lane, Springfield</div>
            </div>
            <div className="landing-mock-meta-right">
              <div>
                <div className="landing-mock-label">Issued</div>
                <div className="landing-mock-value">Jun 30, 2026</div>
              </div>
              <div>
                <div className="landing-mock-label">Due</div>
                <div className="landing-mock-value">Jul 14, 2026</div>
              </div>
            </div>
          </div>

          <div className="landing-mock-table">
            <div className="landing-mock-table-header">
              <span>Description</span>
              <span>Qty</span>
              <span>Rate</span>
              <span>Amount</span>
            </div>
            <div className="landing-mock-table-row">
              <span>Brand identity design</span>
              <span>1</span>
              <span>$1,200</span>
              <span>$1,200</span>
            </div>
            <div className="landing-mock-table-row">
              <span>Landing page build</span>
              <span>1</span>
              <span>$800</span>
              <span>$800</span>
            </div>
            <div className="landing-mock-table-row">
              <span>Support retainer</span>
              <span>2</span>
              <span>$150</span>
              <span>$300</span>
            </div>
          </div>

          <div className="landing-mock-total">
            <span>Total due</span>
            <span>$2,300</span>
          </div>
        </div>
      </div>
    </div>
  )
}
