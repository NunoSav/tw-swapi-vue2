<template>
  <div>
    <div class="mb text-align-center">
      <label for="name">Filter by name </label>
      <input type="text" name="name" id="name" v-model="nameFilter" />

      <br class="mb" />

      <button :disabled="peoplePrevious == null" @click="previousPage()">
        Previous Page
      </button>
      <button :disabled="peopleNext == null" @click="nextPage()">
        Next Page
      </button>
    </div>

    <div class="text-align-center" v-if="loadingData">
      <h3>Loading data ...</h3>
    </div>

    <div v-else>
      <table class="center">
        <thead>
          <tr>
            <th @click="sortByColumn('name')">
              Name
              <span v-if="sortColumn === 'name'">
                <span v-if="sortAsc">↑</span>
                <span v-else>↓</span>
              </span>
            </th>
            <th @click="sortByColumn('height')">
              Height
              <span v-if="sortColumn === 'height'">
                <span v-if="sortAsc">↑</span>
                <span v-else>↓</span>
              </span>
            </th>
            <th @click="sortByColumn('mass')">
              Mass
              <span v-if="sortColumn === 'mass'">
                <span v-if="sortAsc">↑</span>
                <span v-else>↓</span>
              </span>
            </th>
            <th @click="sortByColumn('created')">
              Created
              <span v-if="sortColumn === 'created'">
                <span v-if="sortAsc">↑</span>
                <span v-else>↓</span>
              </span>
            </th>
            <th @click="sortByColumn('edited')">
              Edited
              <span v-if="sortColumn === 'edited'">
                <span v-if="sortAsc">↑</span>
                <span v-else>↓</span>
              </span>
            </th>
            <th @click="sortByColumn('planet')">
              Planet
              <span v-if="sortColumn === 'planet'">
                <span v-if="sortAsc">↑</span>
                <span v-else>↓</span>
              </span>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="$p in filteredAndSortedPeopleList" :key="$p.name">
            <td>{{ $p.name }}</td>
            <td class="text-align-right">{{ $p.height }}</td>
            <td class="text-align-right">{{ $p.mass }}</td>
            <td>{{ $p.created }}</td>
            <td>{{ $p.edited }}</td>
            <td>
              <a
                href="#"
                @click="toggleShowPlanetModal($p.planet)"
                v-if="$p.planet"
              >
                {{ $p.planet.name }}
              </a>
              <font-awesome-icon icon="spinner" v-else />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <planet
      :planet="showPlanet"
      v-if="showPlanetModal"
      @close="toggleShowPlanetModal()"
    ></planet>
  </div>
</template>

<script>
export default {
  name: 'People',

  components: {
    Planet: () => import('@/components/Planet.vue'),
  },

  data() {
    return {
      nameFilter: '',

      loadingData: false,
      people: [],
      peopleNext: null,
      peoplePrevious: null,

      planets: [],

      sortColumn: null,
      sortAsc: true,

      showPlanetModal: false,
      showPlanet: null,
    };
  },

  created() {
    this.getPeople();
  },

  computed: {
    filteredPeopleByName() {
      if (this.nameFilter === '') return this.people;

      return this.people.filter((p) =>
        p.name.toLowerCase().includes(this.nameFilter.toLowerCase())
      );
    },

    filteredAndSortedPeopleList() {
      if (this.sortColumn != null)
        return [...this.filteredPeopleByName].sort(this.sortPeopleList);

      return this.filteredPeopleByName;
    },
  },

  methods: {
    async getPeople(query = '') {
      try {
        this.loadingData = true;
        const { data } = await this.axios.get(`/people${query}`);

        this.peopleNext =
          data.next != null ? `/${data.next.split('/').pop()}` : null;
        this.peoplePrevious =
          data.previous != null ? `/${data.previous.split('/').pop()}` : null;

        if (Array.isArray(data.results)) {
          for await (const result of data.results) {
            const planet = await this.getPlanet(result.homeworld);
            result.planet = planet;
          }

          this.people = data.results;
        }

        this.loadingData = false;
      } catch (error) {
        this.loadingData = false;
        console.error(JSON.stringify(error, null, 2));
      }
    },

    async nextPage() {
      await this.getPeople(this.peopleNext);
    },

    async previousPage() {
      await this.getPeople(this.peoplePrevious);
    },

    async getPlanet(planetURL) {
      try {
        const planet = this.planets.find((p) => p.url === planetURL);
        if (planet) return planet;

        const { data } = await this.axios.get(planetURL);

        this.planets.push(data);
        return data;
      } catch (error) {
        this.loadingData = false;
        console.error(JSON.stringify(error, null, 2));
      }
    },

    sortByColumn(column) {
      this.sortColumn = column;
      this.sortAsc = !this.sortAsc;
    },

    sortPeopleList(peopleA, peopleB) {
      const a = peopleA[this.sortColumn];
      const b = peopleB[this.sortColumn];

      if (a < b) return this.sortAsc ? 1 : -1;
      if (a > b) return this.sortAsc ? -1 : 1;

      return 0;
    },

    toggleShowPlanetModal(planet) {
      if (planet != null) {
        this.showPlanet = planet;
      }
      this.showPlanetModal = !this.showPlanetModal;
    },
  },
};
</script>

<style scoped>
.text-align-right {
  text-align: right;
}

.text-align-center {
  text-align: center;
}

.actions {
  width: 200px;
}

.center {
  margin-left: auto;
  margin-right: auto;
}

.mb {
  margin-bottom: 20px;
}

table {
  border-collapse: collapse;
}

td,
th {
  padding: 8px;
}

thead th {
  cursor: pointer;
  /* color: #46bd87; */
  color: #ffffff;
  background: #4fc3a1;
}

thead th:nth-child(odd) {
  /* color: #ffffff; */
  background: #324960;
}

tr:nth-child(even) {
  background: #f8f8f8;
}
</style>
