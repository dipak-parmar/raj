export default function ReturnPolicyPage() {
  return (
    <div className="pt-32 pb-20 max-w-4xl mx-auto px-6 font-inter text-sm text-textCustom/75 dark:text-lightMint/75 space-y-8 leading-relaxed">
      <h1 className="text-3xl md:text-5xl font-playfair font-bold text-primary dark:text-white mb-2">
        Return & Refund Policy
      </h1>
      <p className="text-xs font-poppins font-bold uppercase tracking-wider text-accent border-b border-black/5 dark:border-white/5 pb-4">
        Updated: July 2026
      </p>

      <section className="space-y-4">
        <h2 className="text-xl font-playfair font-bold text-textCustom dark:text-white">
          1. Return Eligibility Window
        </h2>
        <p>
          Considering the biological nature of organic skincare formulations, returns are only accepted within 7 days of package delivery. The products must remain unused, sealed in their original amber bottles, and within the original boxes.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-playfair font-bold text-textCustom dark:text-white">
          2. Damaged Packages
        </h2>
        <p>
          In the rare event that a glass bottle arrives fractured or spills during shipment, take a picture of the unopened package and send it to our desk via <a href="mailto:dipakparmar2466@gmail.com" className="underline font-semibold">dipakparmar2466@gmail.com</a>. We will dispatch a new bottle immediately.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-playfair font-bold text-textCustom dark:text-white">
          3. Process of Refund
        </h2>
        <p>
          Once we receive and inspect the returned item, a confirmation email will reflect the details. Authorized refunds are processed back to the original payment source (UPI account or bank card) within 5 to 7 business days.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-playfair font-bold text-textCustom dark:text-white">
          4. Exclusions
        </h2>
        <p>
          Custom wholesale formulations, corporate event bulk orders, and products purchased during limited clearance promotional campaigns are not eligible for standard returns or refunds.
        </p>
      </section>
    </div>
  );
}
