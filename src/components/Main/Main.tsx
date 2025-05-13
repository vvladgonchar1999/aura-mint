"use client";

export default function AboutProject() {
  return (
    <section className="bg-black text-white py-16">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-4xl font-bold mb-6">Aura Mint</h2>
          <p className="text-lg mb-6 text-gray-300">
            In the digital age, we often lack genuine emotions in Web3. 
            <span className="text-white font-semibold"> Aura Mint</span> was created to fill that void.
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-4">
            <li>
              Create <span className="text-white">unique NFT phrases</span> that capture your mood or a special moment.
            </li>
            <li>
              Your energy and vibe become a <span className="text-white">digital artifact</span>.
            </li>
            <li>
              Perfect for <span className="text-white">events, group chats, and creators</span>.
            </li>
            <li>
              Each token is verified through community participation.
            </li>
          </ul>
        </div>

        <div /> {/* empty column for layout balance */}
      </div>

      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center mt-24">
        <div className="order-2 md:order-1" />
        <div className="order-1 md:order-2">
          <h2 className="text-3xl font-bold mb-6">Where We're Headed 🚀</h2>
          <ul className="list-disc list-inside text-gray-400 space-y-4">
            <li>Launch of <span className="text-white">full NFT minting</span> on Solana</li>
            <li>Introduction of <span className="text-white">collectible badges</span> for loyal vibers</li>
            <li>Vibe social rankings — support your community</li>
            <li>Mobile support and third-party integrations</li>
            <li>Vibe festivals — <span className="text-white">event collabs</span> and rewards!</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
