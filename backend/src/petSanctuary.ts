import {
  PetSpeciesId,
  PetActionState,
  ViewerPetState,
  PetEvolutionEvent,
} from './types';

export const SPECIES_LIST: PetSpeciesId[] = ['bunny', 'dog', 'cat', 'tiger', 'lion', 'leopard'];

interface StageDef {
  stageId: number;
  minLevel: number;
  name: string;
}

const STAGE_DEFS: Record<PetSpeciesId, StageDef[]> = {
  bunny: [
    { stageId: 1, minLevel: 1, name: 'Thỏ Mầm Sữa' },
    { stageId: 2, minLevel: 3, name: 'Thỏ Đầu Bếp Vani' },
    { stageId: 3, minLevel: 6, name: 'Thỏ Tiên Cánh Bướm Sakura' },
    { stageId: 4, minLevel: 10, name: 'Thỏ Giả Kim Ngọc Bích' },
    { stageId: 5, minLevel: 15, name: 'Thỏ Tiên Nữ Cung Trăng' },
    { stageId: 6, minLevel: 20, name: 'Thỏ Thần Dải Ngân Hà' },
  ],
  dog: [
    { stageId: 1, minLevel: 1, name: 'Cún Sữa Ngậm Xương' },
    { stageId: 2, minLevel: 3, name: 'Cún Thám Tử Sherlock' },
    { stageId: 3, minLevel: 6, name: 'Khuyển Nhẫn Giả Ninja Bóng Đêm' },
    { stageId: 4, minLevel: 10, name: 'Cún Siêu Phàm Cyber-Doge' },
    { stageId: 5, minLevel: 15, name: 'Đại Tướng Quân Khuyển Samurai' },
    { stageId: 6, minLevel: 20, name: 'Thần Khuyển Thái Dương Amaterasu' },
  ],
  cat: [
    { stageId: 1, minLevel: 1, name: 'Mèo Tam Thể Chuông Đỏ' },
    { stageId: 2, minLevel: 3, name: 'Mèo Thuyền Trưởng Hải Tặc' },
    { stageId: 3, minLevel: 6, name: 'Mèo Tiên Cá San Hô Ngọc Bích' },
    { stageId: 4, minLevel: 10, name: 'Mèo Bá Tước Đêm Đỏ (Vampire)' },
    { stageId: 5, minLevel: 15, name: 'Nữ Thần Mèo Ai Cập (Bastet)' },
    { stageId: 6, minLevel: 20, name: 'Cửu Vĩ Thiên Miêu (9 Đuôi)' },
  ],
  tiger: [
    { stageId: 1, minLevel: 1, name: 'Hổ Sữa Mầm Xanh' },
    { stageId: 2, minLevel: 3, name: 'Hổ Võ Sư Quyền Pháp' },
    { stageId: 3, minLevel: 6, name: 'Lôi Hổ Sấm Sét (Thunder)' },
    { stageId: 4, minLevel: 10, name: 'Hỏa Hổ Dung Nham (Magma)' },
    { stageId: 5, minLevel: 15, name: 'Băng Tinh Bạch Hổ (Frost)' },
    { stageId: 6, minLevel: 20, name: 'Thánh Thú Bạch Hổ Long Quân' },
  ],
  lion: [
    { stageId: 1, minLevel: 1, name: 'Sư Tử Bờm Hoa Hướng Dương' },
    { stageId: 2, minLevel: 3, name: 'Sư Tử Ngôi Sao Nhạc Rock' },
    { stageId: 3, minLevel: 6, name: 'Sư Tử Thần Rừng Cổ Thụ (Druid)' },
    { stageId: 4, minLevel: 10, name: 'Sư Vương Chiến Binh Bắc Âu (Viking)' },
    { stageId: 5, minLevel: 15, name: 'Thánh Sư Hiệp Sĩ Hoàng Kim' },
    { stageId: 6, minLevel: 20, name: 'Thần Sư Siêu Tân Tinh (Supernova)' },
  ],
  leopard: [
    { stageId: 1, minLevel: 1, name: 'Báo Đốm Kem Bơ' },
    { stageId: 2, minLevel: 3, name: 'Báo Phi Công Siêu Thanh' },
    { stageId: 3, minLevel: 6, name: 'Báo Quý Ông Cơ Khí (Steampunk)' },
    { stageId: 4, minLevel: 10, name: 'Hắc Báo Sát Thủ Đốm Neon' },
    { stageId: 5, minLevel: 15, name: 'Báo Tuyết Pha Lê Kim Cương Hồng' },
    { stageId: 6, minLevel: 20, name: 'Thần Báo Cực Quang Đa Chiều' },
  ],
};

export class PetSanctuaryManager {
  private pets = new Map<string, ViewerPetState>();
  private recentEvolutions: PetEvolutionEvent[] = [];

  public getExpRequired(level: number): number {
    return Math.floor(55 * Math.pow(Math.max(1, level), 1.32));
  }

  public getStageInfo(species: PetSpeciesId, level: number): { stageId: number; stageName: string } {
    const defs = STAGE_DEFS[species] || STAGE_DEFS.bunny;
    for (let i = defs.length - 1; i >= 0; i--) {
      if (level >= defs[i].minLevel) {
        return { stageId: defs[i].stageId, stageName: defs[i].name };
      }
    }
    return { stageId: 1, stageName: defs[0].name };
  }

  private generateId(prefix = 'pet_evt'): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  }

  private calculateNewPosition(): { x: number; y: number } {
    const slot = this.pets.size;
    const cols = 8;
    const col = slot % cols;
    const row = Math.floor(slot / cols) % 4;

    const baseX = 12 + col * (76 / (cols - 1));
    const baseY = 56 + row * (28 / 3);

    const jitterX = (Math.random() - 0.5) * 6;
    const jitterY = (Math.random() - 0.5) * 5;

    const x = Math.max(10, Math.min(90, Math.round((baseX + jitterX) * 10) / 10));
    const y = Math.max(54, Math.min(86, Math.round((baseY + jitterY) * 10) / 10));

    return { x, y };
  }

  public getOrCreatePet(user: { uniqueId: string; nickname?: string; avatarUrl?: string }): ViewerPetState {
    let pet = this.pets.get(user.uniqueId);
    if (!pet) {
      // Pick random species
      const species = SPECIES_LIST[Math.floor(Math.random() * SPECIES_LIST.length)];
      const { stageId, stageName } = this.getStageInfo(species, 1);
      const now = Date.now();

      pet = {
        uniqueId: user.uniqueId,
        nickname: user.nickname || user.uniqueId,
        avatarUrl:
          user.avatarUrl ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(user.nickname || user.uniqueId)}&background=random`,
        species,
        level: 1,
        exp: 0,
        expRequired: this.getExpRequired(1),
        stageId,
        stageName,
        totalDiamonds: 0,
        totalLikes: 0,
        totalComments: 0,
        actionState: 'idle',
        actionExpiresAt: 0,
        position: this.calculateNewPosition(),
        joinedAt: now,
        lastActiveAt: now,
      };

      this.pets.set(user.uniqueId, pet);
    } else {
      if (user.nickname && pet.nickname !== user.nickname) {
        pet.nickname = user.nickname;
      }
      if (user.avatarUrl && (!pet.avatarUrl || pet.avatarUrl.includes('ui-avatars.com'))) {
        pet.avatarUrl = user.avatarUrl;
      }
    }
    return pet;
  }

  public handleJoin(user: {
    uniqueId: string;
    nickname?: string;
    avatarUrl?: string;
  }): { pet: ViewerPetState; evolutionEvent?: PetEvolutionEvent } {
    const pet = this.getOrCreatePet(user);
    const now = Date.now();

    pet.actionState = 'happy';
    pet.actionExpiresAt = now + 2200;
    pet.lastActiveAt = now;
    pet.lastInteraction = {
      id: this.generateId('join'),
      type: 'join',
      label: 'Mới vào vườn!',
      subtext: pet.stageName,
      timestamp: now,
    };

    return { pet };
  }

  public handleChat(
    user: { uniqueId: string; nickname?: string; avatarUrl?: string },
    comment: string
  ): { pet: ViewerPetState; evolutionEvent?: PetEvolutionEvent } {
    const pet = this.getOrCreatePet(user);
    const now = Date.now();

    pet.totalComments++;
    pet.lastChat = {
      id: this.generateId('chat'),
      text: comment,
      timestamp: now,
    };
    pet.lastActiveAt = now;

    if (pet.actionState !== 'evolving') {
      pet.actionState = 'happy';
      pet.actionExpiresAt = now + 2500;
    }

    const evolutionEvent = this.addExp(pet, 18, now);
    return { pet, evolutionEvent };
  }

  public handleLike(
    user: { uniqueId?: string; nickname?: string; avatarUrl?: string },
    count: number = 1
  ): { pet?: ViewerPetState; evolutionEvent?: PetEvolutionEvent } {
    if (!user.uniqueId) return {};

    const pet = this.getOrCreatePet({
      uniqueId: user.uniqueId,
      nickname: user.nickname,
      avatarUrl: user.avatarUrl,
    });
    const now = Date.now();
    const validCount = Math.max(1, count);
    const gainedExp = 3 * validCount;

    pet.totalLikes += validCount;
    pet.lastActiveAt = now;

    if (pet.actionState !== 'evolving') {
      pet.actionState = 'happy';
      pet.actionExpiresAt = now + 2200;
    }

    pet.lastInteraction = {
      id: this.generateId('like'),
      type: 'like',
      label: `+${gainedExp} EXP`,
      subtext: `❤️ x${validCount}`,
      timestamp: now,
    };

    const evolutionEvent = this.addExp(pet, gainedExp, now);
    return { pet, evolutionEvent };
  }

  public handleGift(
    user: { uniqueId: string; nickname?: string; avatarUrl?: string },
    gift: { giftName: string; diamondCount: number; deltaRepeat: number }
  ): { pet: ViewerPetState; evolutionEvent?: PetEvolutionEvent } {
    const pet = this.getOrCreatePet(user);
    const now = Date.now();

    const addedDiamonds = Math.max(1, (gift.deltaRepeat || 1) * (gift.diamondCount || 0));
    pet.totalDiamonds += addedDiamonds;
    pet.lastActiveAt = now;

    const gainedExp = 45 * addedDiamonds;

    // Determine food
    let foodId = 'clover';
    if (addedDiamonds <= 2) foodId = 'clover';
    else if (addedDiamonds <= 9) foodId = 'carrot';
    else if (addedDiamonds <= 29) foodId = 'strawberry';
    else if (addedDiamonds <= 99) foodId = 'mochi';
    else if (addedDiamonds <= 299) foodId = 'boba';
    else foodId = 'golden_carrot';

    if (pet.actionState !== 'evolving') {
      pet.actionState = 'eating';
      pet.actionExpiresAt = now + 2600;
    }

    pet.lastInteraction = {
      id: this.generateId('gift'),
      type: 'gift',
      label: `+${gainedExp} EXP`,
      subtext: `${gift.giftName} x${gift.deltaRepeat || 1}`,
      foodId,
      timestamp: now,
    };

    const evolutionEvent = this.addExp(pet, gainedExp, now);
    return { pet, evolutionEvent };
  }

  public handleSocial(
    user: { uniqueId: string; nickname?: string; avatarUrl?: string },
    type: 'follow' | 'share' | 'join'
  ): { pet: ViewerPetState; evolutionEvent?: PetEvolutionEvent } {
    if (type === 'join') {
      return this.handleJoin(user);
    }

    const pet = this.getOrCreatePet(user);
    const now = Date.now();
    const gainedExp = 50;

    pet.lastActiveAt = now;
    if (pet.actionState !== 'evolving') {
      pet.actionState = 'playing';
      pet.actionExpiresAt = now + 2500;
    }

    const subtext = type === 'follow' ? 'Đã Follow kênh! 🌟' : 'Đã Chia sẻ live! 🚀';
    pet.lastInteraction = {
      id: this.generateId(type),
      type,
      label: `+${gainedExp} EXP`,
      subtext,
      timestamp: now,
    };

    const evolutionEvent = this.addExp(pet, gainedExp, now);
    return { pet, evolutionEvent };
  }

  private addExp(pet: ViewerPetState, gainedExp: number, now: number): PetEvolutionEvent | undefined {
    const initialStageId = pet.stageId;
    const initialStageName = pet.stageName;

    pet.exp += gainedExp;
    while (pet.exp >= pet.expRequired) {
      pet.exp -= pet.expRequired;
      pet.level += 1;
      pet.expRequired = this.getExpRequired(pet.level);
    }

    const { stageId: newStageId, stageName: newStageName } = this.getStageInfo(pet.species, pet.level);
    pet.stageId = newStageId;
    pet.stageName = newStageName;

    if (newStageId > initialStageId) {
      pet.actionState = 'evolving';
      pet.actionExpiresAt = now + 3600;
      pet.lastInteraction = {
        id: this.generateId('evolve'),
        type: 'evolve',
        label: 'TIẾN HÓA THẦN THÚ! ✨',
        subtext: newStageName,
        timestamp: now,
      };

      const evolutionEvent: PetEvolutionEvent = {
        id: this.generateId('evo_evt'),
        uniqueId: pet.uniqueId,
        nickname: pet.nickname,
        avatarUrl: pet.avatarUrl,
        species: pet.species,
        level: pet.level,
        previousStageId: initialStageId,
        previousStageName: initialStageName,
        newStageId,
        newStageName,
        timestamp: now,
      };

      this.recentEvolutions.unshift(evolutionEvent);
      if (this.recentEvolutions.length > 15) {
        this.recentEvolutions.pop();
      }

      return evolutionEvent;
    }

    return undefined;
  }

  public seedPet(data: {
    uniqueId: string;
    nickname?: string;
    avatarUrl?: string;
    species?: PetSpeciesId;
    level?: number;
    totalDiamonds?: number;
    totalLikes?: number;
    totalComments?: number;
  }): ViewerPetState {
    const pet = this.getOrCreatePet({
      uniqueId: data.uniqueId,
      nickname: data.nickname,
      avatarUrl: data.avatarUrl,
    });

    if (data.species) {
      pet.species = data.species;
    }
    if (typeof data.level === 'number' && data.level > 1) {
      pet.level = data.level;
      pet.expRequired = this.getExpRequired(pet.level);
      const info = this.getStageInfo(pet.species, pet.level);
      pet.stageId = info.stageId;
      pet.stageName = info.stageName;
    }
    if (typeof data.totalDiamonds === 'number') {
      pet.totalDiamonds = data.totalDiamonds;
    }
    if (typeof data.totalLikes === 'number') {
      pet.totalLikes = data.totalLikes;
    }
    if (typeof data.totalComments === 'number') {
      pet.totalComments = data.totalComments;
    }

    return pet;
  }

  public getActivePets(limit = 24): ViewerPetState[] {
    const now = Date.now();
    const petList: ViewerPetState[] = [];

    for (const pet of this.pets.values()) {
      // Revert expired actions to idle
      if (pet.actionExpiresAt > 0 && now >= pet.actionExpiresAt) {
        pet.actionState = 'idle';
        pet.actionExpiresAt = 0;
      }
      // Remove expired chat bubble (> 7000ms)
      if (pet.lastChat && now - pet.lastChat.timestamp > 7000) {
        pet.lastChat = undefined;
      }
      // Random wandering for idle/happy pets when not chatting
      if (!pet.lastChat && pet.actionState !== 'evolving' && Math.random() < 0.38) {
        const deltaX = (Math.random() - 0.5) * 22;
        const deltaY = (Math.random() - 0.5) * 10;
        pet.position = {
          x: Math.max(10, Math.min(90, Math.round((pet.position.x + deltaX) * 10) / 10)),
          y: Math.max(54, Math.min(88, Math.round((pet.position.y + deltaY) * 10) / 10)),
        };
      }
      petList.push({ ...pet });
    }

    // Sort priority:
    // 1. Has active chat (within 7s) or recent interaction (within 12s)
    // 2. Highest level
    // 3. Highest total diamonds
    // 4. Most recently active
    petList.sort((a, b) => {
      const activeScoreA =
        (a.lastChat ? 2 : 0) + (now - a.lastActiveAt <= 12000 ? 1 : 0);
      const activeScoreB =
        (b.lastChat ? 2 : 0) + (now - b.lastActiveAt <= 12000 ? 1 : 0);

      if (activeScoreA !== activeScoreB) {
        return activeScoreB - activeScoreA;
      }
      if (b.level !== a.level) {
        return b.level - a.level;
      }
      if (b.totalDiamonds !== a.totalDiamonds) {
        return b.totalDiamonds - a.totalDiamonds;
      }
      return b.lastActiveAt - a.lastActiveAt;
    });

    return petList.slice(0, limit);
  }

  public getTotalPetsCount(): number {
    return this.pets.size;
  }

  public getRecentEvolutions(): PetEvolutionEvent[] {
    return [...this.recentEvolutions];
  }

  public reset(): void {
    this.pets.clear();
    this.recentEvolutions = [];
  }
}
