import { describe, it, expect } from 'vitest';
import { demoEvents, demoBudgetItems, demoTimeline, demoVendors, demoTasks } from '@/data/demo';
import { aiService } from '@/services/aiService';

describe('Problem Statement Verification: GenAI Event Planning Platform', () => {
  describe('Pillar 1: Event Categories (Weddings, Birthdays, Community Events)', () => {
    it('supports Wedding events with full parameters', () => {
      const wedding = demoEvents.find((e) => e.type === 'wedding');
      expect(wedding).toBeDefined();
      expect(wedding?.name).toContain('Wedding');
      expect(wedding?.guestCount).toBeGreaterThan(0);
      expect(wedding?.budget).toBeGreaterThan(0);
    });

    it('supports Birthday events with milestone parameters', () => {
      const birthday = demoEvents.find((e) => e.type === 'birthday');
      expect(birthday).toBeDefined();
      expect(birthday?.name).toContain('Birthday');
      expect(birthday?.budget).toBeGreaterThan(0);
    });

    it('supports Community events with large-scale civic requirements', () => {
      const community = demoEvents.find((e) => e.type === 'community');
      expect(community).toBeDefined();
      expect(community?.name).toContain('Community');
      expect(community?.guestCount).toBeGreaterThan(100);
      expect(community?.specialRequirements).toContain('permit');
    });
  });

  describe('Pillar 2: Budgets & Financial Optimization', () => {
    it('manages line-item budget items and tracks paid vs unpaid statuses', () => {
      expect(demoBudgetItems.length).toBeGreaterThan(0);
      const paidItem = demoBudgetItems.find((b) => b.paid === true);
      const unpaidItem = demoBudgetItems.find((b) => b.paid === false);
      expect(paidItem).toBeDefined();
      expect(unpaidItem).toBeDefined();
    });

    it('calculates dynamic category allocations via GenAI', async () => {
      const res = await aiService.sendMessage('Recommend budget allocation breakdown for $50000', {
        eventType: 'wedding',
        budget: 50000,
        guestCount: 120,
      });
      expect(res.recommendations?.[0].category).toBe('budget');
      expect(res.text).toContain('Venue');
      expect(res.text).toContain('Catering');
    });
  });

  describe('Pillar 3: Timelines & Day-of Schedules', () => {
    it('contains chronological timeline milestones', () => {
      expect(demoTimeline.length).toBeGreaterThan(0);
      const item = demoTimeline[0];
      expect(item).toHaveProperty('time');
      expect(item).toHaveProperty('title');
    });

    it('generates precision day-of schedule via GenAI', async () => {
      const res = await aiService.sendMessage('Generate event-day run of show schedule', {
        eventType: 'birthday',
        name: 'Gala Night',
      });
      expect(res.recommendations?.[0].category).toBe('schedule');
    });
  });

  describe('Pillar 4: Vendor Checklists & Contract Tracking', () => {
    it('tracks vendor quotations, final agreed prices, and contract milestones', () => {
      expect(demoVendors.length).toBeGreaterThan(0);
      const vendor = demoVendors[0];
      expect(vendor).toHaveProperty('quotedPrice');
      expect(vendor).toHaveProperty('finalPrice');
      expect(vendor).toHaveProperty('bookingStatus');
    });

    it('tracks actionable vendor checklists and milestone status', () => {
      expect(demoTasks.length).toBeGreaterThan(0);
      const task = demoTasks[0];
      expect(task).toHaveProperty('title');
      expect(task).toHaveProperty('status');
      expect(task).toHaveProperty('category');
    });

    it('generates multi-phase vendor and milestone checklists via GenAI', async () => {
      const res = await aiService.sendMessage('Generate milestone checklist', {
        eventType: 'community',
        name: 'Civic Fair',
      });
      expect(res.recommendations?.[0].category).toBe('checklist');
    });
  });

  describe('Pillar 5: Personalized Ideas & Tailored Themes', () => {
    it('generates custom aesthetic themes with color palettes', async () => {
      const res = await aiService.sendMessage('Recommend 3 themes and palettes', {
        eventType: 'wedding',
        name: 'Sarah & James Wedding',
      });
      expect(res.recommendations?.[0].category).toBe('theme');
      expect(res.text).toContain('Color Palette');
    });

    it('generates bespoke copywriting for invitations', async () => {
      const res = await aiService.sendMessage('Draft invitation message suites', {
        eventType: 'birthday',
        name: 'Aria Birthday',
      });
      expect(res.recommendations?.[0].category).toBe('invitation');
    });
  });
});

