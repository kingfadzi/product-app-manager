import { rest } from 'msw';
import { store } from '../store';

export const contactsHandlers = [
  rest.get('/api/apps/:appId/contacts', (req, res, ctx) => {
    const appContacts = store.contacts.filter(c => c.appId === req.params.appId);
    return res(ctx.json(appContacts));
  }),

  rest.post('/api/apps/:appId/contacts', (req, res, ctx) => {
    const newContact = {
      id: `contact-${Date.now()}`,
      appId: req.params.appId,
      ...req.body
    };
    store.contacts.push(newContact);
    return res(ctx.status(201), ctx.json(newContact));
  }),

  rest.put('/api/contacts/:id', (req, res, ctx) => {
    const index = store.contacts.findIndex(c => c.id === req.params.id);
    if (index === -1) {
      return res(ctx.status(404), ctx.json({ error: 'Contact not found' }));
    }
    store.contacts[index] = { ...store.contacts[index], ...req.body };
    return res(ctx.json(store.contacts[index]));
  }),

  rest.delete('/api/contacts/:id', (req, res, ctx) => {
    const index = store.contacts.findIndex(c => c.id === req.params.id);
    if (index === -1) {
      return res(ctx.status(404), ctx.json({ error: 'Contact not found' }));
    }
    store.contacts.splice(index, 1);
    return res(ctx.status(204));
  }),
];
