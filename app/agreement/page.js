import "../globals.css";

export const metadata = {
  title: "Partner Revenue Share Agreement · MindFit Academy",
};

const S = ({ n, title, children }) => (
  <section className="ag-sec">
    <h2>{n}. {title}</h2>
    {children}
  </section>
);

export default function AgreementPage() {
  return (
    <main className="ag-wrap">
      <div className="ag-doc">
        <p className="ag-eyebrow">MindFit Academy</p>
        <h1>Partner Revenue Share Agreement</h1>

        <p>This agreement is between The AEA Institute and the individual partner who accepts this agreement.</p>
        <p>We are excited to work with therapists, coaches, and other trusted professionals who believe in helping people build stronger emotional fitness, resilience, happiness, and mindset skills.</p>
        <p>This agreement explains how the partner relationship works, what AEA provides, what the Partner is responsible for, and how the revenue share is handled.</p>

        <S n="1" title="The Partner Program">
          <p>The AEA Institute operates MindFit Academy and related digital mental-fitness programs, including the Happiness Bootcamp and other programs we may offer from time to time.</p>
          <p>Through this partnership, the Partner may share MindFit Academy programs with clients, families, followers, contacts, or other people who may benefit from them.</p>
          <p>AEA will provide:</p>
          <ol>
            <li>A Company-hosted partner page that may include the Partner&rsquo;s name, credentials, photo, biography, and checkout links to available programs.</li>
            <li>Access to the MindFit Academy programs, content, technology, and customer support needed to fulfill the programs.</li>
            <li>Tracking of sales connected to the Partner.</li>
            <li>Marketing assets, language, links, and suggested messaging the Partner may use to promote the programs.</li>
          </ol>
        </S>

        <S n="2" title="Partner Responsibilities">
          <p>The Partner agrees to promote the programs honestly, professionally, and in a way that reflects well on both the Partner and The AEA Institute.</p>
          <p>The Partner agrees:</p>
          <ol>
            <li>To describe the programs accurately.</li>
            <li>To avoid making promises or guarantees about specific clinical, health, emotional, financial, or personal outcomes.</li>
            <li>To follow all professional, ethical, advertising, and client-communication rules that apply to the Partner&rsquo;s own work.</li>
            <li>To manage the Partner&rsquo;s own professional responsibilities with clients, including any informed consent, dual relationship, or scope-of-practice issues.</li>
            <li>To make clear that MindFit Academy programs are educational and self-help programs, not therapy, diagnosis, medical care, or a replacement for professional treatment.</li>
            <li>Not to use spam, deceptive marketing, purchased email lists, or any misleading outreach practices.</li>
          </ol>
        </S>

        <S n="3" title="Revenue Share and Payment">
          <p>The AEA Institute will pay the Partner a revenue share equal to <strong>50% of the revenue actually received and retained by AEA</strong> from program sales connected to the Partner.</p>
          <p>Revenue share is based only on money AEA actually collects and keeps.</p>
          <p>Refunds, chargebacks, failed payments, reversed payments, discounts, cancellations, or similar adjustments will reduce the revenue share accordingly. If AEA has already paid a revenue share on a sale that is later refunded or charged back, AEA may offset that amount against future payments.</p>
          <p>For subscription-based programs, the Partner will receive the revenue share on amounts actually collected for each billing period in which the customer remains active.</p>
          <p>Before payments can be made, the Partner agrees to provide any tax or payment information AEA reasonably needs, including a completed IRS Form W-9 or other applicable tax form. AEA will issue tax forms, such as a Form 1099, when required.</p>
        </S>

        <S n="4" title="Independent Contractor Relationship">
          <p>The Partner is an independent contractor.</p>
          <p>This agreement does not create an employment relationship, agency relationship, partnership, joint venture, or franchise relationship.</p>
          <p>The Partner is responsible for the Partner&rsquo;s own taxes, business expenses, insurance, professional obligations, and other costs connected to the Partner&rsquo;s own work.</p>
          <p>AEA will not withhold taxes or provide employee benefits to the Partner.</p>
        </S>

        <S n="5" title="Intellectual Property">
          <p>AEA owns the MindFit Academy programs, content, materials, names, marks, technology, partner pages, training materials, videos, exercises, assessments, and related intellectual property.</p>
          <p>AEA gives the Partner permission to use approved MindFit Academy marketing materials only for the purpose of promoting the Partner&rsquo;s page and the programs during the partnership.</p>
          <p>The Partner may not copy, modify, sell, reuse, distribute, or create new products from AEA&rsquo;s content or materials without written permission from AEA.</p>
        </S>

        <S n="6" title="Confidentiality">
          <p>Both AEA and the Partner may receive non-public information from each other.</p>
          <p>Each side agrees to use that information only for the purpose of carrying out this partnership and to protect it with reasonable care.</p>
          <p>This does not apply to information that is already public, was developed independently, or was legally received from another source.</p>
          <p>The Partner agrees not to collect, store, or send protected client health information through the Partner Page or the MindFit Academy programs.</p>
        </S>

        <S n="7" title="Term and Termination">
          <p>This agreement begins when the Partner accepts it and continues until either side ends it.</p>
          <p>Either The AEA Institute or the Partner may end the partnership with 30 days&rsquo; written notice. Email notice is sufficient.</p>
          <p>AEA may also pause or end the partnership sooner if the Partner misuses the program, violates this agreement, uses misleading marketing, harms AEA&rsquo;s reputation, or acts in a way that creates legal, ethical, or professional concern.</p>
          <p>When the partnership ends:</p>
          <ol>
            <li>AEA may deactivate the Partner&rsquo;s page.</li>
            <li>The Partner must stop using AEA&rsquo;s names, marks, links, and marketing materials.</li>
            <li>Any payment owed for completed and retained sales will be handled according to AEA&rsquo;s normal payment process.</li>
          </ol>
        </S>

        <S n="8" title="Acceptance">
          <p>By checking the acceptance box, submitting the partner application, signing below, or otherwise agreeing electronically, the Partner confirms that the Partner has read this agreement, understands it, and agrees to participate under these terms.</p>
        </S>

        <p className="ag-foot">The AEA Institute &middot; MindFit Academy Partner Program</p>
      </div>
    </main>
  );
}
