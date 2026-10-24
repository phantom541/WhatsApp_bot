export default {
  name: 'starter', description: 'See how to choose a starter dragon',
  async execute({ reply, prefix }) {
    return reply('🐉 Starter selection now uses *' + prefix + 'starthunt*.\n1. ' + prefix + 'starthunt\n2. ' + prefix + 'starthunt --skrill\n3. ' + prefix + 'starterdrgon --skrill-choose');
  }
};
