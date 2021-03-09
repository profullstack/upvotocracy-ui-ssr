<script context="module">
  export async function preload(page, session) {
    const { category } = page.params;

    const url = 'API_BASE_URL' + `/category/${category}`;

    const res = await this.fetch(url);
    const categoryData = await res.json();

    return { categoryData };
  }
</script>

<script>
  import CategoryForm from '../../../components/CategoryForm.svelte';

  export let categoryData;
</script>

<CategoryForm category={categoryData} />
