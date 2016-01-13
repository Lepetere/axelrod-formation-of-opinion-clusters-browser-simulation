This is an implementation of the [Axelrod model](http://www-personal.umich.edu/~axe/research/Dissemination.pdf) of "cultural dissemination". It simulations the spreading and clustering of opinions in a society. You can read more about it in my [blog post](http://www.peterfessel.com/2016/01/modeling-formation-of-opinion-clusters-cellular-automata).

The simulation runs in the browser and you can check out a live demo to play with [here](http://projects.peterfessel.com/axelrod-modeling-formation-of-opinion-clusters).

For the implementation I used React.js. The one direction data flow and the self-updating view components enabled me to have to think less about modifying and keeping up to date the view state and instead focus more on the underlying data and the simulation algorithm.
