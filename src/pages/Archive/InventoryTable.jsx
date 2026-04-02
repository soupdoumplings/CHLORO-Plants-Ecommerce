import React from 'react';
import { motion } from 'framer-motion';

const InventoryTable = () => {
  const holdings = [
    { 
      name: "Monstera Deliciosa", 
      id: "SPEC-001-KTM", 
      status: "Optimal", 
      progress: 75, 
      value: "4,500", 
      image: "https://images.pexels.com/photos/7627358/pexels-photo-7627358.jpeg" 
    },
    { 
      name: "Sansevieria 'Laurentii'", 
      id: "SPEC-002-KTM", 
      status: "Optimal", 
      progress: 90, 
      value: "2,200", 
      image: "https://images.pexels.com/photos/3699416/pexels-photo-3699416.jpeg" 
    },
    { 
      name: "Ficus Lyrata", 
      id: "SPEC-842-HIM", 
      status: "Critical", 
      progress: 12, 
      value: "8,900", 
      image: "https://images.pexels.com/photos/8175394/pexels-photo-8175394.jpeg" 
    }
  ];

  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="mb-24 px-12 max-w-[1440px] mx-auto w-full"
    >
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex justify-between items-center mb-12 border-b border-[#B1B3A9]/10 pb-10"
      >
        <h2 className="font-headline text-4xl text-[#31332C] tracking-tighter">Current Holdings</h2>
        <div className="flex gap-8 items-center font-label text-[12px] uppercase tracking-widest">
           <button className="text-[#785A1A] border-b border-[#785A1A] pb-1 font-bold">All Species</button>
           <button className="text-[#5E6058] opacity-50 hover:opacity-100 transition-all pb-1 border-b border-transparent">High Altitude</button>
           <button className="text-[#5E6058] opacity-50 hover:opacity-100 transition-all pb-1 border-b border-transparent">Lowland</button>
           <button className="text-[#5E6058] opacity-50 hover:opacity-100 transition-all pb-1 border-b border-transparent">Equipment</button>
        </div>
      </motion.div>

      <div className="overflow-x-auto w-full">
        <table className="w-full text-left">
           <thead>
              <tr className="border-b border-[#B1B3A9]/20 font-label text-[10px] uppercase tracking-widest text-[#5E6058]/80 font-black">
                <th className="py-6 px-4">Specimen Profile</th>
                <th className="py-6 px-4">Inventory ID</th>
                <th className="py-6 px-4">Curation Health</th>
                <th className="py-6 px-4">Market Position</th>
                <th className="py-6 px-4 text-right">Valuation</th>
                <th className="py-6 px-4 text-right">Actions</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-[#B1B3A9]/10">
             {holdings.map((item, i) => (
               <motion.tr 
                 key={i} 
                 initial={{ opacity: 0, x: -20 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true, margin: '-20px' }}
                 transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                 className="group hover:bg-white transition-all duration-300"
               >
                  <td className="py-8 px-4 flex items-center gap-6">
                     <div className="w-20 h-20 bg-[#EFEEE6] overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                     </div>
                     <div>
                        <p className="font-headline text-2xl text-[#31332C] group-hover:text-[#785A1A] transition-colors">{item.name}</p>
                        <p className="font-label text-[10px] tracking-widest uppercase text-[#5E6058] opacity-70">Kathmandu Indoor Selection</p>
                     </div>
                  </td>
                  <td className="py-8 px-4">
                     <span className="bg-[#E8E9E0] px-4 py-2 font-label text-[10px] tracking-wide uppercase text-[#31332C] font-bold border border-[#797c73]/5">
                        {item.id}
                     </span>
                  </td>
                  <td className="py-8 px-4">
                     <div className="flex items-center gap-3">
                        <span className={`w-2 h-2 rounded-full ${item.status === 'Optimal' ? 'bg-[#456565]' : 'bg-[#9F403D]'}`}></span>
                        <p className="font-body text-sm text-[#31332C] font-medium tracking-tight uppercase">{item.status}</p>
                     </div>
                  </td>
                  <td className="py-8 px-4 w-[200px]">
                     <div className="space-y-3">
                        <div className="flex justify-between font-label text-[9px] uppercase tracking-widest text-[#31332C]">
                           <span className="font-black">Maturity</span>
                           <span className={item.progress < 20 ? 'text-[#9F403D]' : 'text-[#785A1A]'}>{item.progress}%</span>
                        </div>
                        <div className="w-full h-[3px] bg-[#E2E3D9] overflow-hidden relative">
                           <motion.div 
                              initial={{ width: 0 }}
                              whileInView={{ width: `${item.progress}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1.2, delay: 0.3 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                              className={`absolute inset-y-0 left-0 group-hover:opacity-90 ${item.progress < 20 ? 'bg-[#9F403D]' : 'bg-[#785A1A]'}`} 
                           />
                        </div>
                     </div>
                  </td>
                  <td className="py-8 px-4 text-right">
                     <p className="font-headline text-xl text-[#31332C]">रू {item.value}</p>
                  </td>
                  <td className="py-8 px-4">
                     <div className="flex justify-end gap-6 items-center">
                        <button className="material-symbols-outlined text-[#5E6058] hover:text-[#785A1A] transition-colors p-2 hover:bg-[#F5F4ED]">edit_calendar</button>
                        <button className="material-symbols-outlined text-[#5E6058] hover:text-[#9F403D] transition-colors p-2 hover:bg-[#F5F4ED]">archive</button>
                     </div>
                  </td>
               </motion.tr>
             ))}
           </tbody>
        </table>
      </div>
    </motion.section>
  );
};

export default InventoryTable;
