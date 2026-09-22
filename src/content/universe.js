const node = (id, title, blurb, children = [], prompts = [], related = []) => ({ id, title, blurb, children, prompts, related });
const prompt = (id, question, type = "reflection") => ({ id, question, type, suggestedThinkTime: 30, suggestedSpeakTime: 120 });

export const domains = [
  node("mind", "Human Mind", "the strange machinery behind being you", [
    node("identity", "Identity", "the self you keep assembling", [
      node("authenticity", "Authenticity", "who you are when nobody is grading it", [], [prompt("auth-1", "Does behaving differently around different people make you less authentic?")]),
      node("social-self", "Social Self", "the version of you that appears around others", [], [prompt("social-1", "Would you still pursue your ambitions if nobody could ever know what you achieved?", "counterfactual")]),
      node("belonging", "Belonging", "where fitting in meets being yourself", [], [prompt("belong-1", "Can you belong somewhere without changing yourself to fit it?")])
    ]),
    node("memory", "Memory", "the unreliable archive", [
      node("false-memory", "False Memory", "true consequences from invented pasts", [], [prompt("memory-1", "If a false memory shaped who you became, does its accuracy matter?", "boundary")]),
      node("forgetting", "Forgetting", "what vanishes, and what stays", [], [prompt("forget-1", "Is forgetting a failure of memory, or one of its essential jobs?")])
    ]),
    node("emotion", "Emotion", "feelings before explanations", [], [prompt("emotion-1", "Are emotions evidence, or just information?")]),
    node("consciousness", "Consciousness", "the view from inside", [], [prompt("conscious-1", "If a perfect copy of you existed, which one would be you?", "counterfactual")])
  ]),
  node("philosophy", "Philosophy", "questions that refuse to stay solved", [
    node("meaning", "Meaning", "purpose, invented or discovered", [], [prompt("meaning-1", "If your life had no larger purpose, would that necessarily make it less meaningful?")]),
    node("morality", "Morality", "how we decide what ought to be", [], [prompt("moral-1", "Which matters more when judging an action: intention or outcome?", "compare")]),
    node("free-will", "Free Will", "choice inside a chain of causes", [], [prompt("will-1", "Would responsibility still matter if free will turned out to be an illusion?")]),
    node("time", "Time", "the thing everything happens inside", [], [prompt("time-1", "Would immortality make time feel more valuable, or less?")])
  ]),
  node("society", "Society", "the invisible agreements between us", [
    node("norms", "Norms", "rules nobody remembers choosing", [], [prompt("norms-1", "Which everyday rule would look strangest to someone from another century?")]),
    node("status", "Status", "the rooms we rank ourselves inside", [], [prompt("status-1", "Can you stop caring about status, or only choose a different status game?")]),
    node("cities", "Cities", "millions of private lives in public", [], [prompt("cities-1", "What does a city owe the people who cannot afford to stay in it?")]),
    node("generations", "Generations", "stories we tell about age", [], [prompt("gen-1", "Do generations really have personalities, or do we invent them afterward?")])
  ]),
  node("technology", "Technology", "tools that quietly rewrite the user", [
    node("internet", "Internet", "everyone, connected and alone", [
      node("algorithms", "Algorithms", "choices made before you arrive", [
        node("attention", "Attention", "the scarce resource behind the screen", [], [prompt("attention-1", "At what point does personalization stop helping you discover things and start deciding what you become?", "boundary")])
      ]),
      node("digital-identity", "Digital Identity", "the self that keeps posting", [], [prompt("digital-1", "Does the internet remember too much, or do people forgive too little?")])
    ]),
    node("ai", "Artificial Intelligence", "machines that imitate our cleverness", [], [prompt("ai-1", "If a machine makes beautiful art, what exactly are we responding to?")]),
    node("privacy", "Privacy", "the right to remain unobserved", [], [prompt("privacy-1", "Which matters more: privacy or convenience?", "trade-off")]),
    node("automation", "Automation", "what happens when effort disappears", [], [prompt("auto-1", "Which human tasks should remain inefficient on purpose?")])
  ]),
  node("science", "Science", "what we know, and how uncertain we are", [
    node("space", "Space", "the scale that breaks intuition", [], [prompt("space-1", "Would discovering simple alien life change how important humanity feels?")]),
    node("evolution", "Evolution", "design without a designer", [], [prompt("evo-1", "Which parts of modern life are our bodies least prepared for?")]),
    node("uncertainty", "Uncertainty", "honest limits of knowing", [], [prompt("uncertainty-1", "How certain should we be before acting on incomplete evidence?")]),
    node("intelligence", "Intelligence", "many ways to solve a world", [], [prompt("intel-1", "Would we recognize intelligence if it looked nothing like our own?")])
  ]),
  node("culture", "Culture", "the things we make together", [
    node("music", "Music", "organized sound, disorganized feeling", [
      node("taste", "Taste", "preferences with hidden authors", [], [prompt("taste-1", "How much of your taste is actually yours?")]),
      node("nostalgia", "Nostalgia", "memory with warmer lighting", [
        node("past-selves", "Past Selves", "people you were and still carry", [], [prompt("nostalgia-1", "Do we miss the past, or the person we were in it?", "interpretation")])
      ])
    ]),
    node("fashion", "Fashion", "clothes as a public language", [], [prompt("fashion-1", "Can style be original when all clothing borrows from somewhere?")]),
    node("tradition", "Tradition", "old answers carried forward", [], [prompt("tradition-1", "When does preserving a tradition become refusing to grow?")]),
    node("fandom", "Fandom", "caring loudly, together", [], [prompt("fandom-1", "Why does loving something together feel different from loving it alone?")])
  ]),
  node("relationships", "Relationships", "the distance between two inner worlds", [
    node("friendship", "Friendship", "chosen closeness", [], [prompt("friend-1", "Can a friendship be real if you would not choose each other today?")]),
    node("trust", "Trust", "certainty borrowed from someone else", [], [prompt("trust-1", "Is trust something people earn, or something you decide to risk?")]),
    node("boundaries", "Boundaries", "where care meets self-preservation", [], [prompt("boundary-1", "When does protecting your peace become avoiding necessary discomfort?")]),
    node("loneliness", "Loneliness", "being unseen among people", [], [prompt("lonely-1", "Can you feel less lonely alone than with the wrong people?")])
  ]),
  node("economics", "Economics", "what we value when choices cost something", [
    node("money", "Money", "a shared fiction with real consequences", [], [prompt("money-1", "What would disappear if nobody needed money?", "counterfactual")]),
    node("ownership", "Ownership", "the stories behind 'mine'", [], [prompt("own-1", "Can you truly own something that will outlive you?")]),
    node("inequality", "Inequality", "uneven starts and unequal outcomes", [], [prompt("inequality-1", "What kind of inequality, if any, can a fair society accept?")]),
    node("value", "Value", "prices, worth, and the gap between", [], [prompt("value-1", "Why are some of the most useful things paid the least?")])
  ]),
  node("history", "History", "the past, edited by the present", [
    node("progress", "Progress", "change with a flattering name", [], [prompt("progress-1", "What have we gained as a society that might not count as progress?")]),
    node("narratives", "Historical Narratives", "the story that survives", [], [prompt("history-1", "Can a nation tell an honest story about itself and still remain united?")]),
    node("civilizations", "Civilizations", "worlds built to seem permanent", [], [prompt("civ-1", "What ordinary part of our society will future people find hardest to understand?")])
  ]),
  node("art", "Art", "meaning made visible", [
    node("originality", "Originality", "newness assembled from old things", [], [prompt("original-1", "Is originality possible, or just influence rearranged well?")]),
    node("artists", "The Artist", "the person behind the work", [], [prompt("artist-1", "Should knowing something about an artist change how you experience their work?")]),
    node("beauty", "Beauty", "the argument your senses make", [], [prompt("beauty-1", "Can something be beautiful without anyone there to experience it?")])
  ]),
  node("language", "Language", "the shapes available to thought", [
    node("translation", "Translation", "meaning crossing imperfect borders", [], [prompt("translation-1", "Can you fully understand something your language cannot describe?")]),
    node("slang", "Slang", "language moving faster than dictionaries", [], [prompt("slang-1", "What does a generation reveal through the words it invents?")]),
    node("naming", "Naming", "how labels change what they hold", [], [prompt("name-1", "Does naming a feeling help us understand it, or simplify it too much?")])
  ]),
  node("media", "Media", "reality with an editor", [
    node("news", "News", "the world turned into a daily story", [], [prompt("news-1", "Can staying informed make it harder to understand the world?")]),
    node("advertising", "Advertising", "desire with a strategy", [], [prompt("ads-1", "Can an advertisement create a need that did not exist before?")]),
    node("celebrity", "Celebrity", "strangers made familiar", [], [prompt("celeb-1", "Why do we feel entitled to know people who are famous?")]),
    node("storytelling", "Storytelling", "facts arranged to mean something", [], [prompt("story-1", "Does every true story become partly fictional when it is told well?")])
  ]),
  node("nature", "Nature", "a world that does not need us", [
    node("animals", "Animals", "other ways of being alive", [], [prompt("animals-1", "Which human trait are we too quick to deny other animals?")]),
    node("wilderness", "Wilderness", "nature outside our plans", [], [prompt("wild-1", "Can wilderness still exist once humans decide to protect it?")]),
    node("climate", "Climate", "a slow crisis in a fast culture", [], [prompt("climate-1", "Why is it hard to care urgently about changes that happen slowly?")]),
    node("ecosystems", "Ecosystems", "everything affecting everything", [], [prompt("eco-1", "Should nature be protected for its own sake, or for ours?")])
  ]),
  node("work", "Work", "what we do with most of the day", [
    node("ambition", "Ambition", "wanting, sharpened into a plan", [], [prompt("ambition-1", "Would you still want it if nobody could know you achieved it?")]),
    node("productivity", "Productivity", "the pressure to turn time into output", [], [prompt("productive-1", "When does self-improvement become dissatisfaction in disguise?")]),
    node("purpose", "Purpose", "meaning we ask a job to carry", [], [prompt("work-1", "If nobody needed money, what kinds of work would still exist?", "counterfactual")]),
    node("careers", "Careers", "a life explained through a title", [], [prompt("career-1", "How much of a career should be allowed to become an identity?")])
  ]),
  node("everyday", "Everyday Life", "ordinary things with strange depths", [
    node("food", "Food", "need turned ritual", [], [prompt("food-1", "Why does food sometimes taste better when someone else makes it?")]),
    node("objects", "Objects", "the quiet witnesses around us", [], [prompt("object-1", "Why do some objects become difficult to throw away?")]),
    node("boredom", "Boredom", "empty time looking back at you", [], [prompt("boredom-1", "What becomes possible only after you have been bored for a while?")]),
    node("routines", "Routines", "repetition that holds a life together", [], [prompt("routine-1", "Which part of your routine is actually a ritual?")]),
    node("travel", "Travel", "leaving home to notice yourself", [], [prompt("travel-1", "Do we travel to see new places, or to become different people in them?")])
  ])
];

export const rootNode = node("root", "yapboutanything", "find something. think a little. yap about it.", domains);

export function findPath(id, current = rootNode, path = []) {
  const next = [...path, current];
  if (current.id === id) return next;
  for (const child of current.children || []) {
    const found = findPath(id, child, next);
    if (found) return found;
  }
  return null;
}
