import { PetSpeciesId } from '../utils/sound';

export type { PetSpeciesId };

export type HeadGearType =
  | 'none'
  | 'sprout'
  | 'chef_hat'
  | 'sakura_crown'
  | 'witch_hat'
  | 'moon_tiara'
  | 'royal_crown'
  | 'detective_cap'
  | 'ninja_headband'
  | 'samurai_helm'
  | 'pirate_hat'
  | 'shell_crown'
  | 'pharaoh_nemes'
  | 'kungfu_band'
  | 'lightning_horn'
  | 'flame_crest'
  | 'ice_crown'
  | 'dragon_horns'
  | 'antlers'
  | 'viking_helm'
  | 'aviator_goggles'
  | 'steampunk_hat'
  | 'crystal_tiara';

export type FaceGearType =
  | 'none'
  | 'monocle'
  | 'milk_bone'
  | 'ninja_mask'
  | 'cyber_visor'
  | 'eyepatch'
  | 'star_glasses';

export type NeckGearType =
  | 'none'
  | 'scarf'
  | 'bow_tie'
  | 'bell_collar'
  | 'egypt_collar'
  | 'royal_brooch';

export type BackGearType =
  | 'none'
  | 'fairy_wings'
  | 'celestial_ribbon'
  | 'cosmic_wings'
  | 'shuriken_scroll'
  | 'jetpack'
  | 'battle_banners'
  | 'fire_wings'
  | 'vampire_cloak'
  | 'nine_tails'
  | 'ice_wings'
  | 'seraph_wings'
  | 'gear_wings'
  | 'dual_blades'
  | 'prism_wings';

export type AuraGearType =
  | 'none'
  | 'star_halo'
  | 'sun_mirror'
  | 'water_bubbles'
  | 'spirit_orbs'
  | 'lightning_sparks'
  | 'fire_ring'
  | 'bagua_halo'
  | 'eclipse_halo'
  | 'portal_ring';

export interface EvolutionStage {
  id: number;
  minLevel: number;
  name: string;
  subtitle: string;
  description: string;
  visualFeature: string;
  passiveBonusText: string;
  coinPerSec: number;
  expMultiplier: number;
  charmBase: number;
  colors: {
    bodyPrimary: string;
    bodySecondary: string;
    earInner: string;
    cheekColor: string;
    eyeColor: string;
    accentColor: string;
    auraColor: string;
    patternColor?: string;
  };
  gear: {
    head?: HeadGearType;
    face?: FaceGearType;
    neck?: NeckGearType;
    back?: BackGearType;
    aura?: AuraGearType;
  };
  scale: number;
}

export interface PetSpeciesConfig {
  id: PetSpeciesId;
  speciesName: string;
  defaultPetName: string;
  badgeLabel: string;
  shortDesc: string;
  greetingText: string;
  petReactions: {
    head: string;
    belly: string;
    paws: string;
  };
  eatReactions: string[];
  stages: EvolutionStage[];
}

export interface FoodItem {
  id: string;
  name: string;
  category: string;
  cost: number;
  exp: number;
  fullness: number;
  happiness: number;
  energy: number;
  coinReward: number;
  description: string;
  color: string;
}

export interface ActivityLogItem {
  id: string;
  timestamp: string;
  title: string;
  detail: string;
  type: 'feed' | 'pet' | 'play' | 'levelup' | 'evolve' | 'sleep';
}

export const SPECIES_CONFIGS: Record<PetSpeciesId, PetSpeciesConfig> = {
  bunny: {
    id: 'bunny',
    speciesName: 'Thỏ Ngọc',
    defaultPetName: 'Mochi Trắng',
    badgeLabel: 'Biến hóa: Bánh Ngọt · Tiên Hoa · Giả Kim · Cung Trăng',
    shortDesc: 'Từ cục bông sữa hóa thành Đầu Bếp Bánh Ngọt, Tiên Hoa, Học Giả Ngọc Bích đến Thỏ Thần Cung Trăng.',
    greetingText: 'Chào chủ nhân! Đố chủ nhân biết cấp tiếp theo mình sẽ hóa thân thành nghề gì đó~',
    petReactions: {
      head: 'Hì hì, được chủ nhân xoa đôi tai dài thích mê luôn á~',
      belly: 'Á nhột quá hihi! Bụng bánh mochi mềm mại lắm đúng không nè!',
      paws: 'Đập tay cái nào! Đôi chân thỏ nhảy cao nhất khu vườn luôn!',
    },
    eatReactions: [
      'Măm măm... Giòn ngọt quá đi, đôi tai mình rung rinh vì sướng!',
      'Ngon tuyệt cú mèo! Cảm ơn chủ nhân nhiều lắm nha~',
      'Bụng thỏ no căng tròn rồi, năng lượng biến hình đang tràn trề!',
    ],
    stages: [
      {
        id: 1,
        minLevel: 1,
        name: 'Thỏ Mầm Sữa',
        subtitle: 'Bậc 1 · Cấp 1–2 · Hệ Mộc Sơ Sinh',
        description:
          'Cục bông trắng kem mềm mại như bánh mochi sữa tươi. Chiếc tai trái cụp ngây thơ cùng mầm cây xanh non vừa nhú trên đỉnh đầu.',
        visualFeature: 'Lông Trắng Sữa · Tai cụp một bên · Mầm lá xanh non',
        passiveBonusText: '+1 Xu / 1.5s · Hệ số EXP x1.0',
        coinPerSec: 1,
        expMultiplier: 1.0,
        charmBase: 120,
        colors: {
          bodyPrimary: '#FFFFFF',
          bodySecondary: '#F1F5F9',
          earInner: '#FDA4AF',
          cheekColor: '#FB7185',
          eyeColor: '#334155',
          accentColor: '#10B981',
          auraColor: 'rgba(16, 185, 129, 0.16)',
        },
        gear: { head: 'sprout' },
        scale: 0.88,
      },
      {
        id: 2,
        minLevel: 3,
        name: 'Thỏ Đầu Bếp Vani',
        subtitle: 'Bậc 2 · Cấp 3–5 · Hệ Bánh Ngọt',
        description:
          'Sau khi thưởng thức đủ món ngon, bé quyết định đội chiếc mũ Đầu Bếp trắng phồng và thắt nơ đỏ để tự tay làm bánh kem dâu!',
        visualFeature: 'Lông Vàng Vani · Mũ Đầu Bếp Bánh Ngọt · Nơ cổ Dâu Tây',
        passiveBonusText: '+3 Xu / 1.5s · Hệ số EXP x1.2',
        coinPerSec: 3,
        expMultiplier: 1.2,
        charmBase: 280,
        colors: {
          bodyPrimary: '#FEF9C3',
          bodySecondary: '#FDE047',
          earInner: '#FB7185',
          cheekColor: '#F43F5E',
          eyeColor: '#451A03',
          accentColor: '#E11D48',
          auraColor: 'rgba(250, 204, 21, 0.22)',
        },
        gear: { head: 'chef_hat', neck: 'bow_tie' },
        scale: 0.96,
      },
      {
        id: 3,
        minLevel: 6,
        name: 'Thỏ Tiên Cánh Bướm Sakura',
        subtitle: 'Bậc 3 · Cấp 6–9 · Hệ Tinh Linh Hoa',
        description:
          'Bộ lông nhuộm sắc hồng phấn hoa anh đào, trên đầu nở rộ vòng hoa xuân và sau lưng mọc ra đôi cánh bướm tiên lấp lánh.',
        visualFeature: 'Lông Hồng Sakura · Vòng Hoa Đào · Đôi Cánh Bướm Tiên',
        passiveBonusText: '+7 Xu / 1.5s · Hệ số EXP x1.45',
        coinPerSec: 7,
        expMultiplier: 1.45,
        charmBase: 550,
        colors: {
          bodyPrimary: '#FCE7F3',
          bodySecondary: '#FBCFE8',
          earInner: '#EC4899',
          cheekColor: '#DB2777',
          eyeColor: '#831843',
          accentColor: '#EC4899',
          auraColor: 'rgba(236, 72, 153, 0.22)',
        },
        gear: { head: 'sakura_crown', back: 'fairy_wings' },
        scale: 1.03,
      },
      {
        id: 4,
        minLevel: 10,
        name: 'Thỏ Giả Kim Ngọc Bích',
        subtitle: 'Bậc 4 · Cấp 10–14 · Hệ Giả Kim Thuật',
        description:
          'Bộ lông chuyển sang màu xanh Ngọc Bích bạc hà quý hiếm! Bé đeo kính đơn quý tộc, đội mũ học giả giả kim và nghiên cứu đá ma thuật.',
        visualFeature: 'Lông Xanh Ngọc Mint · Kính Đơn Quý Tộc · Mũ Giả Kim Thuật',
        passiveBonusText: '+15 Xu / 1.5s · Hệ số EXP x1.75',
        coinPerSec: 15,
        expMultiplier: 1.75,
        charmBase: 980,
        colors: {
          bodyPrimary: '#CCFBF1',
          bodySecondary: '#99F6E4',
          earInner: '#0D9488',
          cheekColor: '#14B8A6',
          eyeColor: '#134E4A',
          accentColor: '#059669',
          auraColor: 'rgba(20, 184, 166, 0.25)',
        },
        gear: { head: 'witch_hat', face: 'monocle', neck: 'royal_brooch' },
        scale: 1.08,
      },
      {
        id: 5,
        minLevel: 15,
        name: 'Thỏ Tiên Nữ Cung Trăng',
        subtitle: 'Bậc 5 · Cấp 15–19 · Hệ Nguyệt Cung',
        description:
          'Linh thú bầu bạn cùng Hằng Nga trên Nguyệt Cung! Bộ lông tím ánh bạc thanh thoát, đội mạo quan trăng lưỡi liềm và dải lụa tiên bay lượn.',
        visualFeature: 'Lông Tím Ánh Trăng · Vương Miện Nguyệt Cung · Dải Lụa Tiên Nữ',
        passiveBonusText: '+30 Xu / 1.5s · Hệ số EXP x2.15',
        coinPerSec: 30,
        expMultiplier: 2.15,
        charmBase: 1650,
        colors: {
          bodyPrimary: '#EDE9FE',
          bodySecondary: '#C4B5FD',
          earInner: '#7C3AED',
          cheekColor: '#EC4899',
          eyeColor: '#2E1065',
          accentColor: '#8B5CF6',
          auraColor: 'rgba(139, 92, 246, 0.28)',
        },
        gear: { head: 'moon_tiara', back: 'celestial_ribbon', neck: 'royal_brooch' },
        scale: 1.13,
      },
      {
        id: 6,
        minLevel: 20,
        name: 'Thỏ Thần Dải Ngân Hà',
        subtitle: 'Bậc 6 · Cấp 20+ · Thần Thoại Vũ Trụ',
        description:
          'Toàn thân mang sắc Xanh Đêm Vũ Trụ huyền bí điểm ngàn vì sao! Đôi tai tinh vân phát sáng, sải đôi cánh Thiên Giới và vòng hào quang Nhật Nguyệt.',
        visualFeature: 'Lông Xanh Đêm Sao Trời · Đôi Cánh Thiên Giới · Hào Quang Tinh Tú',
        passiveBonusText: '+65 Xu / 1.5s · Hệ số EXP x2.8',
        coinPerSec: 65,
        expMultiplier: 2.8,
        charmBase: 3000,
        colors: {
          bodyPrimary: '#312E81',
          bodySecondary: '#1E1B4B',
          earInner: '#38BDF8',
          cheekColor: '#F472B6',
          eyeColor: '#FDE047',
          accentColor: '#38BDF8',
          auraColor: 'rgba(56, 189, 248, 0.36)',
        },
        gear: { head: 'royal_crown', back: 'cosmic_wings', aura: 'star_halo', neck: 'royal_brooch' },
        scale: 1.18,
      },
    ],
  },

  dog: {
    id: 'dog',
    speciesName: 'Chó Shiba',
    defaultPetName: 'Cún Đậu Đậu',
    badgeLabel: 'Biến hóa: Thám Tử · Ninja · Cyber · Samurai · Thái Dương',
    shortDesc: 'Hành trình bất ngờ từ Cún Sữa ngậm xương -> Thám Tử -> Ninja Làng Lá -> Robot Cyber -> Tướng Quân Samurai -> Thần Khuyển Mặt Trời.',
    greetingText: 'Gâu gâu! Đậu Đậu sẵn sàng phá án, tập nhẫn thuật và bảo vệ khu vườn của chủ nhân!',
    petReactions: {
      head: 'Gâu gâu! Được chủ nhân xoa đầu làm đuôi mình vẫy tít mù luôn nè!',
      belly: 'Ư ư thích quá~ Cún lăn ra phơi bụng cho chủ nhân gãi tiếp nè!',
      paws: 'Bắt tay ngoan chưa nè! Gâu gâu!',
    },
    eatReactions: [
      'Chóp chép... Gâu! Món này thơm nức mũi cún luôn!',
      'Ngon quá chủ nhân ơi, đuôi cún ngoáy tít không dừng được!',
      'Ăn no căng bụng rồi, cún sẵn sàng luyện tuyệt kỹ mới!',
    ],
    stages: [
      {
        id: 1,
        minLevel: 1,
        name: 'Cún Sữa Ngậm Xương',
        subtitle: 'Bậc 1 · Cấp 1–2 · Cún Con Ngây Thơ',
        description:
          'Chú cún Shiba vàng kem mũm mĩm với đôi tai cụp mềm, cặp chân mày hạt đậu và miệng luôn ngậm khúc xương sữa yêu thích.',
        visualFeature: 'Lông Vàng Kem · Tai cụp mềm · Ngậm Khúc Xương Sữa trắng',
        passiveBonusText: '+1 Xu / 1.5s · Hệ số EXP x1.0',
        coinPerSec: 1,
        expMultiplier: 1.0,
        charmBase: 125,
        colors: {
          bodyPrimary: '#FEF3C7',
          bodySecondary: '#FDE68A',
          earInner: '#D97706',
          cheekColor: '#FB7185',
          eyeColor: '#292524',
          accentColor: '#D97706',
          auraColor: 'rgba(245, 158, 11, 0.15)',
          patternColor: '#B45309',
        },
        gear: { face: 'milk_bone' },
        scale: 0.88,
      },
      {
        id: 2,
        minLevel: 3,
        name: 'Cún Thám Tử Sherlock',
        subtitle: 'Bậc 2 · Cấp 3–5 · Hệ Trinh Thám',
        description:
          'Đôi tai dựng đứng thính nhạy, đội mũ thám tử nâu kẻ caro, đeo kính đơn soi dấu vết và quàng khăn len đi tuần tra.',
        visualFeature: 'Lông Nâu Hổ Phách · Mũ Thám Tử · Kính Đơn & Khăn Quàng',
        passiveBonusText: '+3 Xu / 1.5s · Hệ số EXP x1.2',
        coinPerSec: 3,
        expMultiplier: 1.2,
        charmBase: 290,
        colors: {
          bodyPrimary: '#FDE68A',
          bodySecondary: '#F59E0B',
          earInner: '#78350F',
          cheekColor: '#EA580C',
          eyeColor: '#292524',
          accentColor: '#92400E',
          auraColor: 'rgba(217, 119, 6, 0.2)',
          patternColor: '#78350F',
        },
        gear: { head: 'detective_cap', face: 'monocle', neck: 'scarf' },
        scale: 0.96,
      },
      {
        id: 3,
        minLevel: 6,
        name: 'Khuyển Nhẫn Giả Ninja Bóng Đêm',
        subtitle: 'Bậc 3 · Cấp 6–9 · Hệ Nhẫn Thuật',
        description:
          'Bất ngờ hóa thân thành Ninja Shiba lông xám khói! Đeo băng trán kim loại, khăn bịt mặt bí ẩn và phi tiêu Shuriken khổng lồ sau lưng.',
        visualFeature: 'Lông Xám Bạc Ninja · Băng Trán & Khăn Bịt Mặt · Phi Tiêu Shuriken',
        passiveBonusText: '+7 Xu / 1.5s · Hệ số EXP x1.45',
        coinPerSec: 7,
        expMultiplier: 1.45,
        charmBase: 560,
        colors: {
          bodyPrimary: '#CBD5E1',
          bodySecondary: '#94A3B8',
          earInner: '#334155',
          cheekColor: '#F43F5E',
          eyeColor: '#0F172A',
          accentColor: '#2563EB',
          auraColor: 'rgba(59, 130, 246, 0.22)',
          patternColor: '#334155',
        },
        gear: { head: 'ninja_headband', face: 'ninja_mask', back: 'shuriken_scroll' },
        scale: 1.03,
      },
      {
        id: 4,
        minLevel: 10,
        name: 'Cún Siêu Phàm Cyber-Doge',
        subtitle: 'Bậc 4 · Cấp 10–14 · Hệ Công Nghệ Tương Lai',
        description:
          'Nâng cấp công nghệ tương lai với bộ lông Xanh Điện Quang, mắt kính thực tế ảo Laser và đôi cánh tên lửa phản lực Jetpack!',
        visualFeature: 'Lông Xanh Cyber Neon · Kính Thực Tế Ảo Laser · Tên Lửa Phản Lực Jetpack',
        passiveBonusText: '+15 Xu / 1.5s · Hệ số EXP x1.75',
        coinPerSec: 15,
        expMultiplier: 1.75,
        charmBase: 990,
        colors: {
          bodyPrimary: '#A5F3FC',
          bodySecondary: '#22D3EE',
          earInner: '#0E7490',
          cheekColor: '#F472B6',
          eyeColor: '#083344',
          accentColor: '#06B6D4',
          auraColor: 'rgba(6, 182, 212, 0.28)',
          patternColor: '#155E75',
        },
        gear: { face: 'cyber_visor', back: 'jetpack' },
        scale: 1.08,
      },
      {
        id: 5,
        minLevel: 15,
        name: 'Đại Tướng Quân Khuyển Samurai',
        subtitle: 'Bậc 5 · Cấp 15–19 · Hệ Võ Sĩ Đạo',
        description:
          'Oai phong lẫm liệt trong bộ lông Đỏ Chiến Giáp, đầu đội mũ Kabuto sừng vàng ròng và cặp cờ lệnh đại tướng quân tung bay sau lưng.',
        visualFeature: 'Lông Đỏ Chiến Giáp · Mũ Samurai Sừng Vàng · Cờ Lệnh Đại Tướng',
        passiveBonusText: '+30 Xu / 1.5s · Hệ số EXP x2.15',
        coinPerSec: 30,
        expMultiplier: 2.15,
        charmBase: 1680,
        colors: {
          bodyPrimary: '#FECACA',
          bodySecondary: '#F87171',
          earInner: '#991B1B',
          cheekColor: '#EA580C',
          eyeColor: '#450A0A',
          accentColor: '#DC2626',
          auraColor: 'rgba(220, 38, 38, 0.25)',
          patternColor: '#7F1D1D',
        },
        gear: { head: 'samurai_helm', back: 'battle_banners', neck: 'royal_brooch' },
        scale: 1.13,
      },
      {
        id: 6,
        minLevel: 20,
        name: 'Thần Khuyển Thái Dương Amaterasu',
        subtitle: 'Bậc 6 · Cấp 20+ · Thần Thoại Mặt Trời',
        description:
          'Hóa thân thành Thần Khuyển Mặt Trời lông trắng ngà điểm vân lửa đỏ thẫm! Phía sau là Gương Thần Thái Dương rực lửa và đôi cánh Phượng Hoàng.',
        visualFeature: 'Lông Trắng Vân Lửa Thần · Gương Thần Mặt Trời · Đôi Cánh Lửa Thiêng',
        passiveBonusText: '+65 Xu / 1.5s · Hệ số EXP x2.8',
        coinPerSec: 65,
        expMultiplier: 2.8,
        charmBase: 3050,
        colors: {
          bodyPrimary: '#FFFBEB',
          bodySecondary: '#FDE68A',
          earInner: '#EA580C',
          cheekColor: '#EF4444',
          eyeColor: '#9A3412',
          accentColor: '#F97316',
          auraColor: 'rgba(249, 115, 22, 0.36)',
          patternColor: '#DC2626',
        },
        gear: { back: 'fire_wings', aura: 'sun_mirror', neck: 'royal_brooch' },
        scale: 1.18,
      },
    ],
  },

  cat: {
    id: 'cat',
    speciesName: 'Mèo Thần Tài',
    defaultPetName: 'Miu Kem Sữa',
    badgeLabel: 'Biến hóa: Hải Tặc · Tiên Cá · Bá Tước Đêm · Nữ Hoàng Ai Cập · Cửu Vĩ',
    shortDesc: 'Không thể đoán trước: từ Mèo Chuông Đỏ hóa thành Hải Tặc, Tiên Cá San Hô, Mèo Ma Cà Rồng, Nữ Thần Ai Cập đến Cửu Vĩ Thiên Miêu 9 đuôi!',
    greetingText: 'Meo meo~ Mỗi lần tiến hóa Miu lại đổi sang một truyền thuyết hoàn toàn mới đó nha!',
    petReactions: {
      head: 'Meo~ Purrrr... Xoa đầu êm quá làm Miu lim dim mắt luôn nè!',
      belly: 'Meo meo! Chỉ có chủ nhân mới được chạm vào chiếc bụng mềm mại này thôi đó!',
      paws: 'Đệm thịt hồng hào xin chào chủ nhân! Meo~',
    },
    eatReactions: [
      'Nhoàm nhoàm... Meo! Đúng món Miu thích nhất trên đời!',
      'Purrrr~ Ăn ngon thế này Miu sẽ gọi thật nhiều tài lộc về cho chủ nhân!',
      'Meo~ Cái bụng tròn xoe no nê hạnh phúc quá đi!',
    ],
    stages: [
      {
        id: 1,
        minLevel: 1,
        name: 'Mèo Tam Thể Chuông Đỏ',
        subtitle: 'Bậc 1 · Cấp 1–2 · Mèo Nhỏ Chiêu Tài',
        description:
          'Bé mèo trắng kem với vệt vằn cam trên trán, sáu sợi râu xinh và chiếc vòng cổ đỏ đeo chuông vàng leng keng.',
        visualFeature: 'Lông Kem Vằn Cam · Vòng Cổ Đỏ Chuông Vàng · Râu Mèo Xinh',
        passiveBonusText: '+1 Xu / 1.5s · Hệ số EXP x1.0',
        coinPerSec: 1,
        expMultiplier: 1.0,
        charmBase: 125,
        colors: {
          bodyPrimary: '#FFFDF9',
          bodySecondary: '#FEF3C7',
          earInner: '#FB7185',
          cheekColor: '#F43F5E',
          eyeColor: '#065F46',
          accentColor: '#EA580C',
          auraColor: 'rgba(245, 158, 11, 0.15)',
          patternColor: '#D97706',
        },
        gear: { neck: 'bell_collar' },
        scale: 0.88,
      },
      {
        id: 2,
        minLevel: 3,
        name: 'Mèo Thuyền Trưởng Hải Tặc',
        subtitle: 'Bậc 2 · Cấp 3–5 · Hệ Đại Dương Phiêu Lưu',
        description:
          'Căng buồm ra khơi! Bộ lông chuyển màu xám bạc sương mù biển cả, đội mũ Thuyền Trưởng Hải Tặc và đeo băng bịt một mắt cực ngầu.',
        visualFeature: 'Lông Xám Bạc Biển Khơi · Mũ Thuyền Trưởng · Bịt Mắt Hải Tặc',
        passiveBonusText: '+3 Xu / 1.5s · Hệ số EXP x1.2',
        coinPerSec: 3,
        expMultiplier: 1.2,
        charmBase: 290,
        colors: {
          bodyPrimary: '#E2E8F0',
          bodySecondary: '#CBD5E1',
          earInner: '#F43F5E',
          cheekColor: '#FB7185',
          eyeColor: '#0F172A',
          accentColor: '#1E293B',
          auraColor: 'rgba(71, 85, 105, 0.22)',
          patternColor: '#475569',
        },
        gear: { head: 'pirate_hat', face: 'eyepatch', neck: 'scarf' },
        scale: 0.96,
      },
      {
        id: 3,
        minLevel: 6,
        name: 'Mèo Tiên Cá San Hô Ngọc Bích',
        subtitle: 'Bậc 3 · Cấp 6–9 · Hệ Thủy Cung',
        description:
          'Lặn xuống cung điện san hô! Bộ lông mang sắc Xanh Ngọc Biển (Turquoise), đội vương miện vỏ sò ngọc trai và bong bóng nước bay quanh.',
        visualFeature: 'Lông Xanh Biển Ngọc Trai · Vương Miện Vỏ Sò · Bong Bóng Thủy Cung',
        passiveBonusText: '+7 Xu / 1.5s · Hệ số EXP x1.45',
        coinPerSec: 7,
        expMultiplier: 1.45,
        charmBase: 560,
        colors: {
          bodyPrimary: '#CCFBF1',
          bodySecondary: '#5EEAD4',
          earInner: '#F472B6',
          cheekColor: '#EC4899',
          eyeColor: '#0F766E',
          accentColor: '#0D9488',
          auraColor: 'rgba(45, 212, 191, 0.26)',
          patternColor: '#0F766E',
        },
        gear: { head: 'shell_crown', aura: 'water_bubbles' },
        scale: 1.03,
      },
      {
        id: 4,
        minLevel: 10,
        name: 'Mèo Bá Tước Đêm Đỏ (Vampire)',
        subtitle: 'Bậc 4 · Cấp 10–14 · Hệ Quý Tộc Bóng Đêm',
        description:
          'Bộ lông Đen Huyền Bí tương phản với đôi mắt Đỏ Ruby rực sáng! Khoác áo choàng cổ cao Bá Tước Ma Cà Rồng cùng đôi cánh dơi đêm.',
        visualFeature: 'Lông Đen Mắt Đỏ Ruby · Áo Choàng Bá Tước & Cánh Dơi · Nơ Đỏ Quý Tộc',
        passiveBonusText: '+15 Xu / 1.5s · Hệ số EXP x1.75',
        coinPerSec: 15,
        expMultiplier: 1.75,
        charmBase: 990,
        colors: {
          bodyPrimary: '#334155',
          bodySecondary: '#1E293B',
          earInner: '#E11D48',
          cheekColor: '#F43F5E',
          eyeColor: '#EF4444',
          accentColor: '#BE123C',
          auraColor: 'rgba(225, 29, 72, 0.28)',
          patternColor: '#0F172A',
        },
        gear: { back: 'vampire_cloak', neck: 'bow_tie' },
        scale: 1.08,
      },
      {
        id: 5,
        minLevel: 15,
        name: 'Nữ Thần Mèo Ai Cập (Bastet)',
        subtitle: 'Bậc 5 · Cấp 15–19 · Hệ Cổ Đại Hoàng Kim',
        description:
          'Hóa thân thành Nữ Thần Bastet quyền năng của Ai Cập cổ đại! Bộ lông Vàng Hoàng Kim, đội mũ Pharaoh kẻ sọc xanh Lapis và vòng cổ bảo ngọc.',
        visualFeature: 'Lông Vàng Hoàng Kim · Mũ Pharaoh Ai Cập · Vòng Cổ Ngọc Lapis',
        passiveBonusText: '+30 Xu / 1.5s · Hệ số EXP x2.15',
        coinPerSec: 30,
        expMultiplier: 2.15,
        charmBase: 1680,
        colors: {
          bodyPrimary: '#FEF08A',
          bodySecondary: '#FACC15',
          earInner: '#0284C7',
          cheekColor: '#F97316',
          eyeColor: '#0369A1',
          accentColor: '#D97706',
          auraColor: 'rgba(234, 179, 8, 0.3)',
          patternColor: '#0284C7',
        },
        gear: { head: 'pharaoh_nemes', neck: 'egypt_collar' },
        scale: 1.13,
      },
      {
        id: 6,
        minLevel: 20,
        name: 'Cửu Vĩ Thiên Miêu (9 Đuôi)',
        subtitle: 'Bậc 6 · Cấp 20+ · Thần Thoại Linh Giới',
        description:
          'Đạt cảnh giới Linh Miêu 9 Đuôi huyền thoại! Bộ lông Hồng Tím Huyền Ảo, phía sau xòe rộng 9 chiếc đuôi phát sáng cùng ngọc linh hồn lơ lửng.',
        visualFeature: '9 Đuôi Linh Miêu Xòe Rộng · Lông Hồng Tím Tiên Giới · Ngọc Linh Hồn',
        passiveBonusText: '+65 Xu / 1.5s · Hệ số EXP x2.8',
        coinPerSec: 65,
        expMultiplier: 2.8,
        charmBase: 3050,
        colors: {
          bodyPrimary: '#FAE8FF',
          bodySecondary: '#F0ABFC',
          earInner: '#C026D3',
          cheekColor: '#EC4899',
          eyeColor: '#701A75',
          accentColor: '#D946EF',
          auraColor: 'rgba(217, 70, 239, 0.35)',
          patternColor: '#A21CAF',
        },
        gear: { head: 'moon_tiara', back: 'nine_tails', aura: 'spirit_orbs' },
        scale: 1.18,
      },
    ],
  },
  tiger: {
    id: 'tiger',
    speciesName: 'Hổ Dũng Mãnh',
    defaultPetName: 'Hổ Vằn Bơ',
    badgeLabel: 'Biến hóa: Võ Sư · Lôi Điện · Dung Nham · Băng Tuyết · Thần Quân',
    shortDesc: 'Chinh phục 5 nguyên tố tự nhiên: Hổ Sữa -> Võ Sư Kungfu -> Lôi Hổ Sấm Sét -> Hỏa Hổ Dung Nham -> Băng Tinh Bạch Hổ -> Thần Quân Bát Quái!',
    greetingText: 'Grừm grừm~ Mỗi bậc tiến hóa của Hổ sẽ thức tỉnh một nguyên tố thiên nhiên hoàn toàn khác biệt!',
    petReactions: {
      head: 'Grừm~ Chạm vào chữ Vương trên trán hổ là gặp nhiều may mắn lắm đó nha!',
      belly: 'Hihi, tuy là chúa sơn lâm nhưng bụng mình vẫn mềm xèo như bánh bao!',
      paws: 'Cặp vuốt hổ mũm mĩm đập tay cùng chủ nhân nè! Grừm~',
    },
    eatReactions: [
      'Ngoằm ngoằm! Hổ con ăn khỏe lớn nhanh như thổi!',
      'Grừm~ Ngon tuyệt vời! Nguyên tố sức mạnh mới đang thức tỉnh!',
      'No căng bụng rồi, tiếng gầm của mình đã vang rền cả khu vườn!',
    ],
    stages: [
      {
        id: 1,
        minLevel: 1,
        name: 'Hổ Sữa Mầm Xanh',
        subtitle: 'Bậc 1 · Cấp 1–2 · Tiểu Hổ Sơn Lâm',
        description:
          'Chú hổ con vàng cam bụ bẫm với chữ Vương (王) trên trán, hai bên má phúng phính vằn đen và mầm cây nhỏ trên đầu.',
        visualFeature: 'Lông Vàng Cam Vằn Đen · Ấn Chữ Vương (王) · Mầm Lá Xanh',
        passiveBonusText: '+1 Xu / 1.5s · Hệ số EXP x1.0',
        coinPerSec: 1,
        expMultiplier: 1.0,
        charmBase: 130,
        colors: {
          bodyPrimary: '#FDBA74',
          bodySecondary: '#FB923C',
          earInner: '#FEF3C7',
          cheekColor: '#F43F5E',
          eyeColor: '#431407',
          accentColor: '#EA580C',
          auraColor: 'rgba(249, 115, 22, 0.16)',
          patternColor: '#431407',
        },
        gear: { head: 'sprout' },
        scale: 0.88,
      },
      {
        id: 2,
        minLevel: 3,
        name: 'Hổ Võ Sư Quyền Pháp',
        subtitle: 'Bậc 2 · Cấp 3–5 · Hệ Võ Thuật',
        description:
          'Tiểu hổ luyện võ trên đỉnh núi, trán buộc dải băng đỏ Kungfu bay phấp phới, ánh mắt kiên định đầy khí phách.',
        visualFeature: 'Lông Cam Đậm · Băng Trán Đỏ Kungfu · Khăn Choàng Võ Đạo',
        passiveBonusText: '+3 Xu / 1.5s · Hệ số EXP x1.2',
        coinPerSec: 3,
        expMultiplier: 1.2,
        charmBase: 300,
        colors: {
          bodyPrimary: '#FB923C',
          bodySecondary: '#EA580C',
          earInner: '#FDE68A',
          cheekColor: '#DC2626',
          eyeColor: '#292524',
          accentColor: '#DC2626',
          auraColor: 'rgba(220, 38, 38, 0.2)',
          patternColor: '#1C1917',
        },
        gear: { head: 'kungfu_band', neck: 'scarf' },
        scale: 0.96,
      },
      {
        id: 3,
        minLevel: 6,
        name: 'Lôi Hổ Sấm Sét (Thunder)',
        subtitle: 'Bậc 3 · Cấp 6–9 · Hệ Lôi Điện',
        description:
          'Hấp thụ sấm sét giữa trời giông! Bộ lông chuyển màu Vàng Chanh Điện Quang với vằn Xanh Tím, trán mọc Sừng Lôi Điện phóng tia chớp!',
        visualFeature: 'Lông Vàng Chanh Vằn Tím · Sừng Lôi Điện · Tia Chớp Quanh Thân',
        passiveBonusText: '+7 Xu / 1.5s · Hệ số EXP x1.45',
        coinPerSec: 7,
        expMultiplier: 1.45,
        charmBase: 575,
        colors: {
          bodyPrimary: '#FEF08A',
          bodySecondary: '#FACC15',
          earInner: '#818CF8',
          cheekColor: '#6366F1',
          eyeColor: '#312E81',
          accentColor: '#4F46E5',
          auraColor: 'rgba(99, 102, 241, 0.28)',
          patternColor: '#3730A3',
        },
        gear: { head: 'lightning_horn', aura: 'lightning_sparks' },
        scale: 1.03,
      },
      {
        id: 4,
        minLevel: 10,
        name: 'Hỏa Hổ Dung Nham (Magma)',
        subtitle: 'Bậc 4 · Cấp 10–14 · Hệ Hỏa Diệm',
        description:
          'Bước ra từ miệng núi lửa! Bộ lông Đỏ Rực Nham Thạch điểm vằn than hồng, đỉnh đầu bốc ngọn lửa thiêng và vòng lửa hộ thể.',
        visualFeature: 'Lông Đỏ Nham Thạch · Mào Lửa Rực Cháy · Vòng Lửa Hộ Thể',
        passiveBonusText: '+15 Xu / 1.5s · Hệ số EXP x1.75',
        coinPerSec: 15,
        expMultiplier: 1.75,
        charmBase: 1010,
        colors: {
          bodyPrimary: '#FCA5A5',
          bodySecondary: '#EF4444',
          earInner: '#FDE047',
          cheekColor: '#F97316',
          eyeColor: '#7F1D1D',
          accentColor: '#DC2626',
          auraColor: 'rgba(239, 68, 68, 0.3)',
          patternColor: '#7F1D1D',
        },
        gear: { head: 'flame_crest', aura: 'fire_ring' },
        scale: 1.08,
      },
      {
        id: 5,
        minLevel: 15,
        name: 'Băng Tinh Bạch Hổ (Frost)',
        subtitle: 'Bậc 5 · Cấp 15–19 · Hệ Băng Tuyết Vĩnh Cửu',
        description:
          'Từ cực nóng chuyển sang cực hàn! Bạch Hổ Băng Giá mang bộ lông Trắng Tuyết vằn Lam Băng, đội Vương Miện Băng Tinh và đôi cánh Pha Lê Tuyết.',
        visualFeature: 'Bạch Hổ Vằn Lam Băng · Vương Miện Băng Tinh · Cánh Tinh Thể Tuyết',
        passiveBonusText: '+30 Xu / 1.5s · Hệ số EXP x2.15',
        coinPerSec: 30,
        expMultiplier: 2.15,
        charmBase: 1700,
        colors: {
          bodyPrimary: '#F0F9FF',
          bodySecondary: '#BAE6FD',
          earInner: '#38BDF8',
          cheekColor: '#0284C7',
          eyeColor: '#0369A1',
          accentColor: '#0284C7',
          auraColor: 'rgba(56, 189, 248, 0.28)',
          patternColor: '#0369A1',
        },
        gear: { head: 'ice_crown', back: 'ice_wings' },
        scale: 1.13,
      },
      {
        id: 6,
        minLevel: 20,
        name: 'Thánh Thú Bạch Hổ Long Quân',
        subtitle: 'Bậc 6 · Cấp 20+ · Thần Thoại Tứ Tượng',
        description:
          'Đứng đầu Tứ Tượng Thần Thú! Lông Trắng Ngọc Lục Bảo điểm vằn Vàng Rồng, đầu mọc Cặp Sừng Long Vương và vòng Bát Quái Tiên Thiên trấn giữ thiên hà.',
        visualFeature: 'Lông Ngọc Bích Vằn Vàng · Sừng Long Vương · Hào Quang Bát Quái',
        passiveBonusText: '+65 Xu / 1.5s · Hệ số EXP x2.8',
        coinPerSec: 65,
        expMultiplier: 2.8,
        charmBase: 3100,
        colors: {
          bodyPrimary: '#ECFDF5',
          bodySecondary: '#A7F3D0',
          earInner: '#FACC15',
          cheekColor: '#10B981',
          eyeColor: '#064E3B',
          accentColor: '#059669',
          auraColor: 'rgba(16, 185, 129, 0.35)',
          patternColor: '#047857',
        },
        gear: { head: 'dragon_horns', back: 'cosmic_wings', aura: 'bagua_halo', neck: 'royal_brooch' },
        scale: 1.18,
      },
    ],
  },

  lion: {
    id: 'lion',
    speciesName: 'Sư Tử Bờm Bông',
    defaultPetName: 'Simba Nắng Ấm',
    badgeLabel: 'Biến hóa: Nhạc Rock · Thần Rừng · Viking · Thánh Kỵ Sĩ · Siêu Tân Tinh',
    shortDesc: 'Chiếc bờm sư tử biến đổi ngoạn mục: Bờm Hoa Cúc -> Bờm Tím Nhạc Rock -> Bờm Lá Cây Thần Rừng -> Bờm Băng Viking -> Bờm Thánh Quang -> Bờm Siêu Tân Tinh!',
    greetingText: 'Gầm vang rực rỡ! Hãy xem chiếc bờm của mình biến hóa qua từng cấp độ nhé!',
    petReactions: {
      head: 'Oa~ Chải chiếc bờm bông xù làm mình thấy oai vệ và ấm áp vô cùng!',
      belly: 'Hihi, tiểu vương thảo nguyên cũng thích được chủ nhân gãi bụng lắm nha!',
      paws: 'Đập tay quyền lực cùng sư tử nào!',
    },
    eatReactions: [
      'Ngoàm ngoằm! Ăn no giúp chiếc bờm của mình đổi sang sắc màu mới cực kỳ độc đáo!',
      'Ngon tuyệt! Năng lượng bá vương đang tràn ngập khắp cơ thể mình rồi!',
      'Cảm ơn chủ nhân! Mình sẽ bảo vệ khu vườn thật bình yên!',
    ],
    stages: [
      {
        id: 1,
        minLevel: 1,
        name: 'Sư Tử Bờm Hoa Hướng Dương',
        subtitle: 'Bậc 1 · Cấp 1–2 · Tiểu Vương Thảo Nguyên',
        description:
          'Chú sư tử con với chiếc bờm bông vàng nâu mềm mại như cánh hoa hướng dương quanh mặt và chiếc mầm xanh trên đỉnh đầu.',
        visualFeature: 'Bờm Hoa Hướng Dương · Lông Vàng Nắng · Mầm Lá Xanh',
        passiveBonusText: '+1 Xu / 1.5s · Hệ số EXP x1.0',
        coinPerSec: 1,
        expMultiplier: 1.0,
        charmBase: 130,
        colors: {
          bodyPrimary: '#FDE68A',
          bodySecondary: '#FCD34D',
          earInner: '#D97706',
          cheekColor: '#FB7185',
          eyeColor: '#451A03',
          accentColor: '#D97706',
          auraColor: 'rgba(245, 158, 11, 0.16)',
          patternColor: '#B45309',
        },
        gear: { head: 'sprout' },
        scale: 0.88,
      },
      {
        id: 2,
        minLevel: 3,
        name: 'Sư Tử Ngôi Sao Nhạc Rock',
        subtitle: 'Bậc 2 · Cấp 3–5 · Hệ Âm Nhạc Sôi Động',
        description:
          'Bùng nổ cá tính! Chiếc bờm nhuộm màu Tím Hồng Neon rực rỡ, đeo cặp kính râm Ngôi Sao nhạc Rock và nơ cổ sành điệu!',
        visualFeature: 'Bờm Tím Hồng Neon · Kính Râm Ngôi Sao · Nơ Cổ Biểu Diễn',
        passiveBonusText: '+3 Xu / 1.5s · Hệ số EXP x1.2',
        coinPerSec: 3,
        expMultiplier: 1.2,
        charmBase: 300,
        colors: {
          bodyPrimary: '#FCE7F3',
          bodySecondary: '#FBCFE8',
          earInner: '#DB2777',
          cheekColor: '#EC4899',
          eyeColor: '#4C1D95',
          accentColor: '#9333EA',
          auraColor: 'rgba(147, 51, 234, 0.22)',
          patternColor: '#9333EA',
        },
        gear: { face: 'star_glasses', neck: 'bow_tie' },
        scale: 0.96,
      },
      {
        id: 3,
        minLevel: 6,
        name: 'Sư Tử Thần Rừng Cổ Thụ (Druid)',
        subtitle: 'Bậc 3 · Cấp 6–9 · Hệ Đại Ngàn Tự Nhiên',
        description:
          'Hòa làm một với rừng già! Chiếc bờm hóa thành tán lá xanh rì đính hoa rừng, trên đầu mọc cặp Gạc Hươu Thần Rừng uy nghiêm.',
        visualFeature: 'Bờm Tán Lá Xanh Rì · Cặp Sừng Hươu Thần Rừng · Thân Gỗ Ấm',
        passiveBonusText: '+7 Xu / 1.5s · Hệ số EXP x1.45',
        coinPerSec: 7,
        expMultiplier: 1.45,
        charmBase: 575,
        colors: {
          bodyPrimary: '#DCFCE7',
          bodySecondary: '#BBF7D0',
          earInner: '#15803D',
          cheekColor: '#22C55E',
          eyeColor: '#14532D',
          accentColor: '#16A34A',
          auraColor: 'rgba(22, 163, 74, 0.24)',
          patternColor: '#15803D',
        },
        gear: { head: 'antlers' },
        scale: 1.03,
      },
      {
        id: 4,
        minLevel: 10,
        name: 'Sư Vương Chiến Binh Bắc Âu (Viking)',
        subtitle: 'Bậc 4 · Cấp 10–14 · Hệ Băng Giá Phương Bắc',
        description:
          'Vượt biển băng Bắc Âu! Lông xám bạc chiến trận với chiếc bờm Xanh Đại Dương Sâu, đội mũ sắt Viking có cặp sừng cong dũng mãnh.',
        visualFeature: 'Bờm Xanh Băng Bắc Âu · Mũ Sắt Sừng Viking · Giáp Vai Chiến Binh',
        passiveBonusText: '+15 Xu / 1.5s · Hệ số EXP x1.75',
        coinPerSec: 15,
        expMultiplier: 1.75,
        charmBase: 1010,
        colors: {
          bodyPrimary: '#E2E8F0',
          bodySecondary: '#CBD5E1',
          earInner: '#1D4ED8',
          cheekColor: '#3B82F6',
          eyeColor: '#1E3A8A',
          accentColor: '#2563EB',
          auraColor: 'rgba(37, 99, 235, 0.25)',
          patternColor: '#1E3A8A',
        },
        gear: { head: 'viking_helm', neck: 'royal_brooch' },
        scale: 1.08,
      },
      {
        id: 5,
        minLevel: 15,
        name: 'Thánh Sư Hiệp Sĩ Hoàng Kim',
        subtitle: 'Bậc 5 · Cấp 15–19 · Hệ Thánh Quang',
        description:
          'Bờm Bạch Kim Thánh Khiết tỏa sáng quanh thân hình Hoàng Kim, đội Vương Miện Ngọc Bích và sải đôi cánh Thiên Sứ Seraphim rực rỡ.',
        visualFeature: 'Bờm Bạch Kim & Thân Vàng · Vương Miện Đế Vương · Cánh Thiên Sứ',
        passiveBonusText: '+30 Xu / 1.5s · Hệ số EXP x2.15',
        coinPerSec: 30,
        expMultiplier: 2.15,
        charmBase: 1700,
        colors: {
          bodyPrimary: '#FEF08A',
          bodySecondary: '#FACC15',
          earInner: '#D97706',
          cheekColor: '#F59E0B',
          eyeColor: '#78350F',
          accentColor: '#B45309',
          auraColor: 'rgba(250, 204, 21, 0.3)',
          patternColor: '#F8FAFC',
        },
        gear: { head: 'royal_crown', back: 'seraph_wings', neck: 'royal_brooch' },
        scale: 1.13,
      },
      {
        id: 6,
        minLevel: 20,
        name: 'Thần Sư Siêu Tân Tinh (Supernova)',
        subtitle: 'Bậc 6 · Cấp 20+ · Thần Thoại Vũ Trụ',
        description:
          'Chiếc bờm kết tinh từ vụ nổ Siêu Tân Tinh mang sắc Tím Đỏ Hỏa Cầu, phía sau là vòng hào quang Nhật Thực Toàn Phần nuốt chửng bóng tối!',
        visualFeature: 'Bờm Lửa Tím Siêu Tân Tinh · Hào Quang Nhật Thực · Cánh Tinh Vân',
        passiveBonusText: '+65 Xu / 1.5s · Hệ số EXP x2.8',
        coinPerSec: 65,
        expMultiplier: 2.8,
        charmBase: 3100,
        colors: {
          bodyPrimary: '#31102F',
          bodySecondary: '#1E1B4B',
          earInner: '#F97316',
          cheekColor: '#EC4899',
          eyeColor: '#FDE047',
          accentColor: '#EA580C',
          auraColor: 'rgba(234, 88, 12, 0.36)',
          patternColor: '#C026D3',
        },
        gear: { head: 'royal_crown', back: 'fire_wings', aura: 'eclipse_halo', neck: 'royal_brooch' },
        scale: 1.18,
      },
    ],
  },

  leopard: {
    id: 'leopard',
    speciesName: 'Báo Đốm Hoa Mai',
    defaultPetName: 'Báo Tuyết Nhí',
    badgeLabel: 'Biến hóa: Phi Công · Steampunk · Hắc Báo Neon · Pha Lê Hồng · Cực Quang',
    shortDesc: 'Biến đổi họa tiết đốm độc nhất vô nhị: Đốm Hoa Mai -> Phi Công -> Quý Ông Cơ Khí Steampunk -> Hắc Báo Đốm Xanh Neon -> Báo Kim Cương Hồng -> Thần Báo Cực Quang!',
    greetingText: 'Chào chủ nhân! Những đốm hoa mai trên người mình sẽ đổi màu cực kỳ ảo diệu qua mỗi lần tiến hóa!',
    petReactions: {
      head: 'Purrrr~ Xoa đầu làm những đốm hoa mai của mình lấp lánh vui sướng!',
      belly: 'Hihi, bụng báo con mềm mại và ấm áp lắm đó nha!',
      paws: 'Đập tay tốc độ ánh sáng cùng báo con nè!',
    },
    eatReactions: [
      'Nhoàm nhoàm! Ăn ngon giúp mình chạy nhanh như một tia chớp!',
      'Tuyệt quá chủ nhân ơi! Đôi mắt mình sáng rực lên vì hạnh phúc!',
      'Bụng no tròn rồi, chiếc đuôi đốm dài của mình đang đung đưa vui vẻ nè!',
    ],
    stages: [
      {
        id: 1,
        minLevel: 1,
        name: 'Báo Đốm Kem Bơ',
        subtitle: 'Bậc 1 · Cấp 1–2 · Tiểu Báo Thảo Nguyên',
        description:
          'Chú báo con vàng kem với những đốm hoa mai nâu socola tròn xinh trên má và bụng, trên đỉnh đầu có chiếc mầm xanh non.',
        visualFeature: 'Lông Kem Đốm Socola · Mắt Ngọc Lục Bảo · Mầm Lá Xanh',
        passiveBonusText: '+1 Xu / 1.5s · Hệ số EXP x1.0',
        coinPerSec: 1,
        expMultiplier: 1.0,
        charmBase: 130,
        colors: {
          bodyPrimary: '#FEF3C7',
          bodySecondary: '#FDE68A',
          earInner: '#F59E0B',
          cheekColor: '#FB7185',
          eyeColor: '#065F46',
          accentColor: '#D97706',
          auraColor: 'rgba(245, 158, 11, 0.15)',
          patternColor: '#78350F',
        },
        gear: { head: 'sprout' },
        scale: 0.88,
      },
      {
        id: 2,
        minLevel: 3,
        name: 'Báo Phi Công Siêu Thanh',
        subtitle: 'Bậc 2 · Cấp 3–5 · Hệ Bầu Trời Tốc Độ',
        description:
          'Đội mũ da phi công gắn kính chắn gió trên trán và quàng khăn lụa đỏ, sẵn sàng lao vút đi với vận tốc âm thanh!',
        visualFeature: 'Lông Vàng Nghệ · Mũ Kính Phi Công · Khăn Quàng Đỏ Bay Gió',
        passiveBonusText: '+3 Xu / 1.5s · Hệ số EXP x1.2',
        coinPerSec: 3,
        expMultiplier: 1.2,
        charmBase: 300,
        colors: {
          bodyPrimary: '#FDE047',
          bodySecondary: '#FACC15',
          earInner: '#B45309',
          cheekColor: '#F97316',
          eyeColor: '#14532D',
          accentColor: '#CA8A04',
          auraColor: 'rgba(234, 179, 8, 0.2)',
          patternColor: '#451A03',
        },
        gear: { head: 'aviator_goggles', neck: 'scarf' },
        scale: 0.96,
      },
      {
        id: 3,
        minLevel: 6,
        name: 'Báo Quý Ông Cơ Khí (Steampunk)',
        subtitle: 'Bậc 3 · Cấp 6–9 · Hệ Bánh Răng Thời Gian',
        description:
          'Phong cách Steampunk cổ điển! Bộ lông màu Đồng Đỏ, đội mũ chóp cao gắn bánh răng vàng, đeo kính đơn và đôi cánh cơ khí sau lưng.',
        visualFeature: 'Lông Đồng Cổ Điển · Mũ Chóp Bánh Răng · Kính Đơn & Cánh Cơ Khí',
        passiveBonusText: '+7 Xu / 1.5s · Hệ số EXP x1.45',
        coinPerSec: 7,
        expMultiplier: 1.45,
        charmBase: 575,
        colors: {
          bodyPrimary: '#FDBA74',
          bodySecondary: '#D97706',
          earInner: '#FEF08A',
          cheekColor: '#EA580C',
          eyeColor: '#451A03',
          accentColor: '#B45309',
          auraColor: 'rgba(180, 83, 9, 0.24)',
          patternColor: '#451A03',
        },
        gear: { head: 'steampunk_hat', face: 'monocle', back: 'gear_wings' },
        scale: 1.03,
      },
      {
        id: 4,
        minLevel: 10,
        name: 'Hắc Báo Sát Thủ Đốm Neon',
        subtitle: 'Bậc 4 · Cấp 10–14 · Hệ Ẩn Thân Bóng Tối',
        description:
          'Sự lột xác ngoạn mục: Bộ lông chuyển sang Đen Tím Bóng Đêm với những đốm hoa mai phát sáng màu Xanh Lục Neon và song kiếm sau lưng!',
        visualFeature: 'Thân Đen Đốm Xanh Lục Neon · Khăn Bịt Mặt · Song Kiếm Ánh Sáng',
        passiveBonusText: '+15 Xu / 1.5s · Hệ số EXP x1.75',
        coinPerSec: 15,
        expMultiplier: 1.75,
        charmBase: 1010,
        colors: {
          bodyPrimary: '#1E293B',
          bodySecondary: '#0F172A',
          earInner: '#4ADE80',
          cheekColor: '#22C55E',
          eyeColor: '#4ADE80',
          accentColor: '#10B981',
          auraColor: 'rgba(34, 197, 94, 0.28)',
          patternColor: '#22C55E',
        },
        gear: { face: 'ninja_mask', back: 'dual_blades' },
        scale: 1.08,
      },
      {
        id: 5,
        minLevel: 15,
        name: 'Báo Tuyết Pha Lê Kim Cương Hồng',
        subtitle: 'Bậc 5 · Cấp 15–19 · Hệ Bảo Thạch',
        description:
          'Kiêu sa lộng lẫy! Bộ lông Hồng Thạch Anh điểm những đốm Kim Cương Xanh Lam, đội Vương Miện Pha Lê và đôi cánh Lăng Kính Cầu Vồng.',
        visualFeature: 'Lông Hồng Đốm Lam Ngọc · Vương Miện Pha Lê · Cánh Lăng Kính',
        passiveBonusText: '+30 Xu / 1.5s · Hệ số EXP x2.15',
        coinPerSec: 30,
        expMultiplier: 2.15,
        charmBase: 1700,
        colors: {
          bodyPrimary: '#FCE7F3',
          bodySecondary: '#F9A8D4',
          earInner: '#38BDF8',
          cheekColor: '#F43F5E',
          eyeColor: '#0284C7',
          accentColor: '#EC4899',
          auraColor: 'rgba(244, 114, 182, 0.28)',
          patternColor: '#0284C7',
        },
        gear: { head: 'crystal_tiara', back: 'prism_wings', neck: 'royal_brooch' },
        scale: 1.13,
      },
      {
        id: 6,
        minLevel: 20,
        name: 'Thần Báo Cực Quang Đa Chiều',
        subtitle: 'Bậc 6 · Cấp 20+ · Thần Thoại Hư Không',
        description:
          'Bậc thầy xuyên không gian! Bộ lông Xanh Ngọc Lục Bảo Vũ Trụ điểm đốm Sao Vàng Kim, sải cánh Cực Quang và Cổng Không Gian xoáy tròn phía sau.',
        visualFeature: 'Lông Xanh Cực Quang Đốm Vàng · Cổng Không Gian · Cánh Thiên Giới',
        passiveBonusText: '+65 Xu / 1.5s · Hệ số EXP x2.8',
        coinPerSec: 65,
        expMultiplier: 2.8,
        charmBase: 3100,
        colors: {
          bodyPrimary: '#065F46',
          bodySecondary: '#064E3B',
          earInner: '#FDE047',
          cheekColor: '#34D399',
          eyeColor: '#FACC15',
          accentColor: '#10B981',
          auraColor: 'rgba(16, 185, 129, 0.36)',
          patternColor: '#FACC15',
        },
        gear: { head: 'crystal_tiara', back: 'cosmic_wings', aura: 'portal_ring', neck: 'royal_brooch' },
        scale: 1.18,
      },
    ],
  },
};

export const SPECIES_ORDER: PetSpeciesId[] = [
  'bunny',
  'dog',
  'cat',
  'tiger',
  'lion',
  'leopard',
];

export const FOOD_ITEMS: FoodItem[] = [
  {
    id: 'clover',
    name: 'Cỏ Mật & Bánh Thưởng Nhỏ',
    category: 'Thức ăn cơ bản · Miễn phí',
    cost: 0,
    exp: 22,
    fullness: 14,
    happiness: 6,
    energy: 4,
    coinReward: 8,
    description: 'Phần ăn nhẹ tươi ngon luôn có sẵn miễn phí trong vườn, giúp thú cưng no bụng và nhận thêm Xu.',
    color: '#10B981',
  },
  {
    id: 'carrot',
    name: 'Cà Rốt & Xương Sữa Giòn',
    category: 'Dinh dưỡng hữu cơ · Phổ biến',
    cost: 12,
    exp: 52,
    fullness: 24,
    happiness: 14,
    energy: 8,
    coinReward: 0,
    description: 'Giòn rụm giàu canxi và vitamin giúp các bé thú cưng khỏe mạnh, mượt lông.',
    color: '#F97316',
  },
  {
    id: 'strawberry',
    name: 'Dâu Tây Kem Phô Mai',
    category: 'Trái cây & Sữa · Yêu thích',
    cost: 32,
    exp: 115,
    fullness: 28,
    happiness: 26,
    energy: 15,
    coinReward: 0,
    description: 'Vị ngọt thanh hòa quyện kem phô mai béo ngậy làm đôi má thú cưng ửng hồng rạng rỡ.',
    color: '#F43F5E',
  },
  {
    id: 'mochi',
    name: 'Bánh Mochi Thịt & Đào Tiên',
    category: 'Bánh thủ công · Cao cấp',
    cost: 75,
    exp: 240,
    fullness: 42,
    happiness: 38,
    energy: 25,
    coinReward: 0,
    description: 'Bánh mềm dẻo thơm lừng giàu dưỡng chất, kích thích thú cưng tăng trưởng cấp tốc.',
    color: '#EC4899',
  },
  {
    id: 'boba',
    name: 'Sữa Tươi Trân Châu Đường Đen',
    category: 'Đồ uống năng lượng · Đặc biệt',
    cost: 150,
    exp: 460,
    fullness: 35,
    happiness: 55,
    energy: 50,
    coinReward: 0,
    description: 'Ly sữa tươi thượng hạng tiếp thêm nguồn năng lượng dồi dào cho mọi loài thú.',
    color: '#8B5CF6',
  },
  {
    id: 'golden_carrot',
    name: 'Báu Vật Vàng Cung Trăng',
    category: 'Báu vật thần thoại · Cực phẩm',
    cost: 340,
    exp: 1050,
    fullness: 100,
    happiness: 100,
    energy: 100,
    coinReward: 0,
    description: 'Tuyệt phẩm hội tụ linh khí nhật nguyệt, hồi phục 100% mọi chỉ số và bứt phá cấp độ tiến hóa!',
    color: '#EAB308',
  },
];

export function getStageForSpeciesLevel(
  speciesId: PetSpeciesId,
  level: number
): EvolutionStage {
  const stages = SPECIES_CONFIGS[speciesId].stages;
  let currentStage = stages[0];
  for (const stage of stages) {
    if (level >= stage.minLevel) {
      currentStage = stage;
    }
  }
  return currentStage;
}

export function getNextEvolutionStageForSpecies(
  speciesId: PetSpeciesId,
  level: number
): EvolutionStage | null {
  const stages = SPECIES_CONFIGS[speciesId].stages;
  for (const stage of stages) {
    if (stage.minLevel > level) {
      return stage;
    }
  }
  return null;
}

export function getExpRequiredForLevel(level: number): number {
  return Math.floor(60 * Math.pow(level, 1.38));
}
