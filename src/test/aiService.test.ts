import { describe, it, expect } from 'vitest';
import { aiService, type AIPlanningContext } from '@/services/aiService';

describe('AI Event Planning Assistant Service', () => {
  it('returns valid provider metadata', () => {
    const info = aiService.getProviderInfo();
    expect(info).toHaveProperty('provider');
    expect(info).toHaveProperty('isLive');
    expect(info).toHaveProperty('model');
    expect(info).toHaveProperty('description');
  });

  describe('Tailored Event Planning: Weddings', () => {
    const weddingContext: AIPlanningContext = {
      eventType: 'wedding',
      name: 'Victoria & Arthur Napa Wedding',
      location: 'Napa Valley, CA',
      guestCount: 175,
      budget: 85000,
      theme: 'Terracotta Harvest & Tuscan Glow',
      specialRequirements: 'Wheelchair access, outdoor evening heating',
    };

    it('generates luxury wedding themes & palettes', async () => {
      const response = await aiService.sendMessage('Recommend 3 themes and color palettes', weddingContext);
      expect(response.sender).toBe('ai');
      expect(response.text).toContain('Terracotta Harvest');
      expect(response.recommendations).toBeDefined();
      expect(response.recommendations?.[0].category).toBe('theme');
    });

    it('generates precision wedding day-of run of show schedule', async () => {
      const response = await aiService.sendMessage('Generate event-day run of show schedule', weddingContext);
      expect(response.text).toContain('Ceremony');
      expect(response.recommendations?.[0].category).toBe('schedule');
    });

    it('generates multi-phase wedding milestone checklist', async () => {
      const response = await aiService.sendMessage('Generate planning checklist', weddingContext);
      expect(response.text).toContain('Phase 1');
      expect(response.recommendations?.[0].category).toBe('checklist');
    });

    it('generates letterpress wedding invitation wording suites', async () => {
      const response = await aiService.sendMessage('Draft invitation message wording', weddingContext);
      expect(response.text).toContain('honour of your presence');
      expect(response.recommendations?.[0].category).toBe('invitation');
    });
  });

  describe('Tailored Event Planning: Birthdays', () => {
    const birthdayContext: AIPlanningContext = {
      eventType: 'birthday',
      name: "Leo's 40th Penthouse Celebration",
      location: 'Manhattan, NY',
      guestCount: 85,
      budget: 15000,
      theme: 'Midnight Velvet & 24K Gold',
    };

    it('generates vibrant birthday lounge themes', async () => {
      const response = await aiService.sendMessage('Recommend theme concepts', birthdayContext);
      expect(response.text).toContain('Midnight Velvet & 24K Gold');
      expect(response.recommendations?.[0].title).toContain('Midnight Velvet');
    });

    it('generates birthday schedule with cake cutting and toast', async () => {
      const response = await aiService.sendMessage('Generate schedule run of show', birthdayContext);
      expect(response.text).toContain('Cake Cutting');
      expect(response.recommendations?.[0].category).toBe('schedule');
    });

    it('generates birthday specific party checklists', async () => {
      const response = await aiService.sendMessage('Generate to do checklist', birthdayContext);
      expect(response.text).toContain('BIRTHDAY CELEBRATION');
      expect(response.recommendations?.[0].category).toBe('checklist');
    });

    it('generates celebratory birthday invitation wording', async () => {
      const response = await aiService.sendMessage('Draft invitation message wording', birthdayContext);
      expect(response.text).toContain('Milestone Birthday');
    });
  });

  describe('Tailored Event Planning: Community Events', () => {
    const communityContext: AIPlanningContext = {
      eventType: 'community',
      name: 'Oakwood Spring Heritage Festival',
      location: 'Austin, TX',
      guestCount: 800,
      budget: 45000,
      theme: 'Terra & Harvest Civic Symphony',
    };

    it('generates civic festival themes', async () => {
      const response = await aiService.sendMessage('Recommend themes', communityContext);
      expect(response.text).toContain('Terra & Harvest Civic Symphony');
    });

    it('generates community festival schedule with safety inspection and keynotes', async () => {
      const response = await aiService.sendMessage('Generate run of show timeline schedule', communityContext);
      expect(response.text).toContain('Municipal Inspection');
      expect(response.text).toContain('Festival Gates Open');
    });

    it('generates municipal permit and volunteer checklists for community events', async () => {
      const response = await aiService.sendMessage('Generate checklist', communityContext);
      expect(response.text).toContain('COMMUNITY FESTIVAL');
      expect(response.text).toContain('Permits');
    });

    it('generates civic gala and community invitation drafts', async () => {
      const response = await aiService.sendMessage('Draft invitation wording', communityContext);
      expect(response.text).toContain('Community Gala');
    });
  });

  describe('Budget Planning & Cost Savings', () => {
    const context: AIPlanningContext = {
      eventType: 'wedding',
      name: 'Sophia & Liam Gala',
      guestCount: 150,
      budget: 60000,
    };

    it('calculates dynamic category allocations', async () => {
      const response = await aiService.sendMessage('Recommend budget allocation breakdown', context);
      expect(response.recommendations?.[0].category).toBe('budget');
      expect(response.text).toContain('Venue & Facilities');
      expect(response.text).toContain('Catering & Beverage');
    });

    it('formulates practical cost savings', async () => {
      const response = await aiService.sendMessage('Suggest cost-saving ideas', context);
      expect(response.recommendations?.[0].category).toBe('cost-saving');
      expect(response.text).toContain('Savings');
    });
  });
});
