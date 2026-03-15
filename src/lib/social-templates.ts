import type { Animal } from './types';

export type SocialPlatform = 'facebook' | 'instagram' | 'x';

interface TemplateContext {
  name: string;
  species: string;
  breed: string;
  age: string;
  gender: string;
  size: string;
  description: string;
  tags: string[];
  shelterName: string;
}

function buildContext(animal: Animal, shelterName: string): TemplateContext {
  return {
    name: animal.name,
    species: animal.species,
    breed: animal.breed,
    age: animal.age ?? 'unknown age',
    gender: animal.gender,
    size: animal.size,
    description: animal.description,
    tags: animal.tags,
    shelterName,
  };
}

// ---------------------------------------------------------------------------
// Template pools – each platform has several templates picked at random
// ---------------------------------------------------------------------------

const facebookTemplates: ((c: TemplateContext) => string)[] = [
  (c) =>
`Meet ${c.name}! 🐾

${c.name} is a ${c.age} ${c.gender} ${c.breed} looking for a forever home. ${c.description}

${c.tags.length > 0 ? `What makes ${c.name} special: ${c.tags.join(', ')}\n\n` : ''}${c.name} is waiting at ${c.shelterName}. Could you be the one to give ${c.name} a second chance?

🏠 Adopt today — visit us or call for more info!
#AdoptDontShop #${c.species.charAt(0).toUpperCase() + c.species.slice(1)}sOfShelter #Rescue${c.species.charAt(0).toUpperCase() + c.species.slice(1)}`,

  (c) =>
`🌟 ADOPTION SPOTLIGHT 🌟

Say hello to ${c.name}, a ${c.size} ${c.breed} who's ready to steal your heart! At ${c.age} old, this ${c.gender === 'male' ? 'good boy' : c.gender === 'female' ? 'good girl' : 'sweetheart'} has so much love to give.

"${c.description}"

${c.tags.length > 0 ? `Bonus: ${c.name} is ${c.tags.join(', ')}!\n\n` : ''}Come meet ${c.name} at ${c.shelterName}. Share this post — you might just help ${c.name} find a family! ❤️

#AdoptDontShop #ShelterPets #ForeverHome`,

  (c) =>
`THIS FACE. 😍

${c.name} is a ${c.age} ${c.breed} (${c.size}, ${c.gender}) and has been patiently waiting for someone to take ${c.gender === 'male' ? 'him' : c.gender === 'female' ? 'her' : 'them'} home.

${c.description}

${c.tags.length > 0 ? `A few fun facts: ${c.tags.join(' • ')}\n\n` : ''}📍 ${c.shelterName}
📞 Contact us to schedule a meet-and-greet!

Every share helps! 🐾
#Adopt #Rescue #${c.breed.replace(/\s+/g, '')}`,
];

const instagramTemplates: ((c: TemplateContext) => string)[] = [
  (c) =>
`🐾 MEET ${c.name.toUpperCase()} 🐾

${c.age} • ${c.breed} • ${c.size} • ${c.gender}

${c.description}

${c.tags.length > 0 ? c.tags.map(t => `✨ ${t}`).join('\n') + '\n\n' : ''}This ${c.species} is ready for a forever home! Visit ${c.shelterName} to meet ${c.name} in person.

.
.
.
#adoptdontshop #rescue${c.species} #shelterpets #${c.breed.toLowerCase().replace(/\s+/g, '')} #adoptme #furryfriends #rescueismyfavoritebreed #${c.shelterName.toLowerCase().replace(/\s+/g, '')}`,

  (c) =>
`Could this be your new best friend? 🥹

${c.name} is a ${c.age} ${c.breed} with a heart of gold. ${c.description}

${c.tags.length > 0 ? `Special qualities: ${c.tags.join(' | ')}\n\n` : ''}📍 Available now at ${c.shelterName}
💛 Double-tap if you think ${c.name} deserves a home!

#adoptdontshop #rescue${c.species} #shelterdog #${c.name.toLowerCase()} #adoptabledogs #rescuedismyfavoritebreed`,

  (c) =>
`New friend alert! 🚨

${c.name} just became available for adoption and we're absolutely smitten. This ${c.size} ${c.breed} is ${c.age} and looking for ${c.gender === 'male' ? 'his' : c.gender === 'female' ? 'her' : 'their'} person.

${c.description}

Tag someone who needs a ${c.species} in their life! 👇

📍 ${c.shelterName}

#adoptdontshop #rescuepets #shelterlove #fosteringsaveslives #${c.breed.toLowerCase().replace(/\s+/g, '')}mix`,
];

const xTemplates: ((c: TemplateContext) => string)[] = [
  (c) =>
`🐾 Meet ${c.name}! ${c.age} ${c.breed} (${c.gender}) looking for a forever home at ${c.shelterName}.

${c.description.length > 100 ? c.description.slice(0, 100) + '…' : c.description}

#AdoptDontShop #Rescue${c.species.charAt(0).toUpperCase() + c.species.slice(1)}`,

  (c) =>
`This is ${c.name}, and ${c.gender === 'male' ? 'he' : c.gender === 'female' ? 'she' : 'they'} would really love to go home with you ❤️

${c.breed} • ${c.age} • ${c.size}

Come meet ${c.name} at ${c.shelterName}! RT to help find ${c.name} a family 🙏

#AdoptDontShop`,

  (c) =>
`ADOPTION ALERT 🚨

${c.name} — ${c.age} ${c.breed}, ${c.size}, ${c.gender}
📍 ${c.shelterName}

${c.description.length > 80 ? c.description.slice(0, 80) + '…' : c.description}

${c.tags.length > 0 ? c.tags.slice(0, 3).join(' • ') + '\n\n' : ''}Repost = more eyes = better chance 🐾
#AdoptDontShop #ShelterPets`,
];

const platformPools: Record<SocialPlatform, ((c: TemplateContext) => string)[]> = {
  facebook: facebookTemplates,
  instagram: instagramTemplates,
  x: xTemplates,
};

export function generatePost(animal: Animal, shelterName: string, platform: SocialPlatform): string {
  const ctx = buildContext(animal, shelterName);
  const pool = platformPools[platform];
  const template = pool[Math.floor(Math.random() * pool.length)];
  return template(ctx);
}

export function generateAllPlatforms(animal: Animal, shelterName: string): Record<SocialPlatform, string> {
  return {
    facebook: generatePost(animal, shelterName, 'facebook'),
    instagram: generatePost(animal, shelterName, 'instagram'),
    x: generatePost(animal, shelterName, 'x'),
  };
}
