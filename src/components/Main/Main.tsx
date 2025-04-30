"use client";

import Image from "next/image";

export default function AboutProject() {
  return (
    <section className="bg-black text-white py-16">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        
        <div>
          <h2 className="text-4xl font-bold mb-6">Aura Mint</h2>
          <p className="text-lg mb-6 text-gray-300">
            В епоху цифрової взаємодії нам бракує справжніх емоцій у Web3. 
            <span className="text-white font-semibold"> Aura Mint</span> створено, щоб заповнити цю прогалину.
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-4">
            <li>
              Створюй <span className="text-white">унікальні NFT-фрази</span>, що відображають твій настрій чи момент.
            </li>
            <li>
              Ваша енергія та вайб стають <span className="text-white">цифровим артефактом</span>.
            </li>
            <li>
              Ідеально підходить для <span className="text-white">івентів, чат-груп та креаторів</span>.
            </li>
            <li>
              Кожен токен верифікується через участь спільноти.
            </li>
          </ul>
        </div>

       
        <div className="relative h-96 w-full rounded-2xl overflow-hidden shadow-lg">
          <Image
            src="/images/vibe-mood.jpg" // додати
            alt="Vibe NFT Mood"
            layout="fill"
            objectFit="cover"
            className="opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
        </div>
      </div>
    
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center mt-24">
        
        <div className="relative h-96 w-full rounded-2xl overflow-hidden shadow-lg order-2 md:order-1">
          <Image
            src="/future-roadmap.png"  // додати
            alt="Roadmap"
            layout="fill"
            objectFit="cover"
            className="opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
        </div>

        
        <div className="order-1 md:order-2">
          <h2 className="text-3xl font-bold mb-6">Куди ми рухаємося 🚀</h2>
          <ul className="list-disc list-inside text-gray-400 space-y-4">
            <li>Запуск <span className="text-white">повноцінного NFT-мінтингу</span> на Solana</li>
            <li>Додання <span className="text-white">колекційних бейджів</span> для постійних вайберів</li>
            <li>Соціальні рейтинги вайбів — підтримка спільноти</li>
            <li>Мобільна підтримка та інтеграція зі сторонніми сервісами</li>
            <li>Фестивалі вайбів — <span className="text-white">event collabs</span> та нагородження!</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
