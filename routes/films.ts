import { Router, Request, Response } from 'express';

const router = Router();



// exercice 1.1
const films = [
  {
    id: 1,
    title: 'Inception',
    director: 'Christopher Nolan',
    duration: 148,
    budget: 160,
    description: 'A mind-bending thriller about dream invasion.',
    imageUrl: 'https://example.com/inception.jpg'
  },
  { 
    id: 2,
    title: 'The Matrix',
    director: 'The Wachowskis',
    duration: 136,
    budget: 63,
    description: 'A computer hacker learns about the true nature of reality.',
    imageUrl: 'https://example.com/matrix.jpg'
  },
  {
    id: 3,
    title: 'Interstellar',
    director: 'Christopher Nolan',
    duration: 169,
    budget: 165,
    description: 'A space adventure to find a new home for humanity.',
    imageUrl: 'https://example.com/interstellar.jpg'
  }
];

// Exercice 1.3

// GET /films - Récupérer tous les films
router.get('/', (req: Request, res: Response) => {
  res.json(films);
});
router.get('/', (req: Request, res: Response) => {
    const minDuration = req.query['minimum-duration'];
  
    if (minDuration) {
      const minDurationNum = parseInt(minDuration as string, 10);
      if (isNaN(minDurationNum) || minDurationNum <= 0) {
        return res.status(400).json({ error: 'Wrong minimum duration' });
      }
      const filteredFilms = films.filter(film => film.duration >= minDurationNum);
      return res.json(filteredFilms);
    }
    const titleStart = req.query['title-start'] as string;
    if (titleStart) {
        const filteredFilmsB = films.filter(film => film.title.toLowerCase().startsWith(titleStart.toLowerCase()));
  }
    res.json(films);
  });
  
  // GET /films/:id - Lire un film par ID
  router.get('/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const film = films.find(f => f.id === id);
  
    if (!film) {
        return res.status(404).json({ error: `Film with ID ${id} not found` });
    }
    res.json(film);
  });
  
  // POST /films - Créer un nouveau film
  // POST /films - Afficher erreur client
  router.post('/', (req: Request, res: Response) => {
    const { title, director, duration, budget, description, imageUrl } = req.body;

     // Validation des champs obligatoires
    if (!title || !director || !duration) {
      return res.status(400).json({ error: 'Missing required fields: title, director, and duration' });
    }
  
    // Vérification que duration et budget sont des nombres positifs
    if (typeof duration !== 'number' || duration <= 0) {
      return res.status(400).json({ error: 'Duration must be a positive number' });
    }
  
    if (budget && (typeof budget !== 'number' || budget <= 0)) {
      return res.status(400).json({ error: 'Budget must be a positive number if provided' });
    }
  
    // Création du nouvel objet film
    const newFilm = {
      id: films.length + 1, // Génération d'un ID simple
      title,
      director,
      duration,
      budget,
      description,
      imageUrl
    };
  
    films.push(newFilm);
    res.status(201).json(newFilm);
  });
  // Tri des films
  // Exercice 1.4
  
  router.post('/', (req: Request, res: Response) => {
    let result = films;
    const sortBy = req.query['sort-by'] as string;
    if (sortBy) {
      const validFields = ['title', 'duration', 'budget'];
      if (!validFields.includes(sortBy)) {
        return res.status(400).json({ error: `Invalid sort-by field. Must be one of ${validFields.join(', ')}` });
      }
  
      const order = req.query['order'] === 'desc' ? -1 : 1;
      result = result.sort((a, b) => {
        const fieldA = a[sortBy as keyof typeof a];
        const fieldB = b[sortBy as keyof typeof b];
  
        if (typeof fieldA === 'string' && typeof fieldB === 'string') {
          return fieldA.localeCompare(fieldB) * order;
        }
  
        if (typeof fieldA === 'number' && typeof fieldB === 'number') {
          return (fieldA - fieldB) * order;
        }
  
        return 0;
      });
    }
  
    res.json(result);
  });
  // Exercice 1.6
  router.delete("/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = films.findIndex((film) => film.id === id);
    if (index === -1) {
      return res.sendStatus(404);
    }
    const deletedElements = films.splice(index, 1); // splice() returns an array of the deleted elements
    return res.json(deletedElements[0]);
  });

  router.patch('/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const film = films.find(f => f.id === id);
  
    if (!film) {
        return res.status(404).json({ error: `Film with ID ${id} not found` });
    }
    const { title, director, duration, budget, description, imageUrl } = req.body;

    if (duration !== undefined && (typeof duration !== 'number' || duration <= 0)) {
      return res.status(400).json({ error: 'Duration must be a positive number' });
    }
  
    if (budget !== undefined && (typeof budget !== 'number' || budget <= 0)) {
      return res.status(400).json({ error: 'Budget must be a positive number if provided' });
    }
    if (title) {
      film.title = title;
    }
    if (director) {
      film.director = director;
    }
    if (description) {
      film.description = description;
    }
    if (imageUrl) {
      film.imageUrl = imageUrl;
    }
    if (duration!==undefined) {
      film.duration = duration;
    }
    if (budget!==undefined) {
      film.budget = budget;
    }
    

    res.json(film);
  });

 
  

export default router;