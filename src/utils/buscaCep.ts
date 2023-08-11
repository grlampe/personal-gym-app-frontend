export async function fetchAddressByCEP(cep: string): Promise<Record<string, any> | undefined> {
  const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  if (response.ok) {
    const data = await response.json();
    if (!data?.erro) {
      return {
        addressStreet: data?.logradouro,
        addressDistrict: data?.bairro,
        addressCity: data?.localidade,
        addressState: data?.uf,
      };
    }
  }
}