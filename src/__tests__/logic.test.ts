import { validatePrompts } from '../utils/validation';
import { filterPrompts, normalize } from '../utils/filterPrompts';
import { Prompt } from '../utils/types';

const p = (over: Partial<Prompt> = {}): Prompt => ({
  id: 'x-001',
  titulo: 'Título',
  categoria: 'Marketing',
  ferramenta: 'ChatGPT',
  descricao: 'Descrição',
  prompt: 'Texto',
  ...over,
});

describe('validatePrompts', () => {
  it('aceita entradas válidas', () => {
    expect(validatePrompts({ prompts: [p()] })).toHaveLength(1);
  });

  it('descarta entradas com campos faltando ou vazios', () => {
    const raw = { prompts: [p(), { id: 'y', titulo: '' }, { titulo: 'sem id' }, null] };
    expect(validatePrompts(raw)).toHaveLength(1);
  });

  it('descarta ids duplicados mantendo o primeiro', () => {
    const raw = { prompts: [p({ titulo: 'A' }), p({ titulo: 'B' })] };
    const out = validatePrompts(raw);
    expect(out).toHaveLength(1);
    expect(out[0].titulo).toBe('A');
  });

  it('sobrevive a estruturas totalmente inválidas', () => {
    expect(validatePrompts(null)).toEqual([]);
    expect(validatePrompts({})).toEqual([]);
    expect(validatePrompts({ prompts: 'nada' })).toEqual([]);
  });
});

describe('normalize', () => {
  it('remove acentos e caixa', () => {
    expect(normalize('Edição de Fóto')).toBe('edicao de foto');
  });
});

describe('filterPrompts', () => {
  const base = {
    query: '',
    categoria: 'Todos',
    ferramentas: [] as string[],
    soFavoritos: false,
    favoritos: [] as string[],
    sort: 'padrao' as const,
    recentes: [] as string[],
  };
  const data = [
    p({ id: '1', titulo: 'Calendário editorial', categoria: 'Marketing', ferramenta: 'ChatGPT' }),
    p({ id: '2', titulo: 'Análise SWOT', categoria: 'Negócios', ferramenta: 'Claude' }),
    p({ id: '3', titulo: 'Retrato épico', categoria: 'Imagens', ferramenta: 'Midjourney' }),
  ];

  it('busca sem acento encontra título com acento', () => {
    expect(filterPrompts(data, { ...base, query: 'analise' })).toHaveLength(1);
  });

  it('filtra por categoria', () => {
    expect(filterPrompts(data, { ...base, categoria: 'Imagens' })[0].id).toBe('3');
  });

  it('multi-seleção de ferramentas', () => {
    const out = filterPrompts(data, { ...base, ferramentas: ['ChatGPT', 'Claude'] });
    expect(out.map((x) => x.id)).toEqual(['1', '2']);
  });

  it('apenas favoritos', () => {
    const out = filterPrompts(data, { ...base, soFavoritos: true, favoritos: ['2'] });
    expect(out.map((x) => x.id)).toEqual(['2']);
  });

  it('ordenação A-Z em pt-BR', () => {
    const out = filterPrompts(data, { ...base, sort: 'az' });
    expect(out.map((x) => x.id)).toEqual(['2', '1', '3']);
  });

  it('ordenação por mais usados coloca recentes primeiro', () => {
    const out = filterPrompts(data, { ...base, sort: 'recentes', recentes: ['3', '1'] });
    expect(out.map((x) => x.id)).toEqual(['3', '1', '2']);
  });
});
