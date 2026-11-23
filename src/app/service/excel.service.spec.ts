import {ExcelService} from './excel.service';

describe('ExcelService sheet names', () => {
  let service: ExcelService;

  beforeEach(() => {
    service = new ExcelService();
  });

  it('should drop characters Excel refuses and cap the length', () => {
    const name: string = (service as any).uniqueSheetName('Spring/Gala: 2026 [final] * silent auction night', new Set<string>());

    expect(name).not.toMatch(/[\\/?*:[\]]/);
    expect(name.length).toBeLessThanOrEqual(31);
  });

  it('should de-duplicate names that collide', () => {
    const used = new Set<string>();

    expect((service as any).uniqueSheetName('Gala', used)).toBe('Gala');
    expect((service as any).uniqueSheetName('gala', used)).toBe('gala (2)');
  });
});
