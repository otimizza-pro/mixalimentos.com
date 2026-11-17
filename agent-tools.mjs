// Pure public tools: no orders, storage, network requests or message sending.
export function createAgentTools(data) {
  const {products,cities,whatsapp,domain}=data;
  const object=(value,keys)=>{
    if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).some(key=>!keys.includes(key)))throw new Error('Parâmetros inválidos.');
  };
  const cityName=value=>{
    if(value===undefined)return '';
    if(typeof value!=='string'||!value.trim()||value.length>100)throw new Error('Informe uma cidade com até 100 caracteres.');
    return value.trim();
  };
  const normalize=value=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const citySchema={type:'string',minLength:1,maxLength:100,description:'Nome da cidade, sem endereço ou dados pessoais.'};
  const annotations={readOnlyHint:true,destructiveHint:false,idempotentHint:true,openWorldHint:false};
  return [
    {name:'mix_list_products',description:'Consulta os três produtos públicos da Mix Alimentos. Não informa preços ou estoque em tempo real.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations,execute(input={}){
      object(input,[]);
      return {products:products.map(p=>({...p,url:domain+'/'+p.id+'/'})),note:'Apresentação, disponibilidade e condições são confirmadas pelo WhatsApp.'};
    }},
    {name:'mix_delivery_area',description:'Consulta as cidades atendidas pela Mix. A cobertura não confirma prazo, frete ou disponibilidade para um endereço.',inputSchema:{type:'object',properties:{city:citySchema},additionalProperties:false},annotations,execute(input={}){
      object(input,['city']);const city=cityName(input.city);
      return {cities,requestedCity:city,listedCity:city?cities.some(c=>normalize(c)===normalize(city)):null,note:'Entregas programadas conforme a rota e a disponibilidade para o endereço. Consulte o atendimento para confirmar.'};
    }},
    {name:'mix_prepare_quote',description:'Prepara uma lista de cotação e um link de WhatsApp para revisão humana. Não abre o aplicativo, não envia mensagens, não reserva produtos e não confirma pedidos.',inputSchema:{type:'object',properties:{city:citySchema,items:{type:'array',minItems:1,maxItems:3,items:{type:'object',properties:{product:{type:'string',enum:products.map(p=>p.id)},quantity:{type:'number',minimum:0.5,maximum:1000000},unit:{type:'string',enum:['caixa','pacote','unidade','fardo']}},required:['product'],additionalProperties:false}}},required:['items'],additionalProperties:false},annotations,execute(input){
      object(input,['city','items']);const city=cityName(input.city);
      if(!Array.isArray(input.items)||!input.items.length||input.items.length>3)throw new Error('Selecione de um a três produtos.');
      const seen=new Set();
      const items=input.items.map(item=>{
        object(item,['product','quantity','unit']);const product=products.find(p=>p.id===item.product);
        if(!product||seen.has(item.product))throw new Error('Produto inválido ou repetido.');seen.add(item.product);
        const eggs=item.product==='ovos-de-galinha',quail=item.product==='ovos-de-codorna-em-conserva';
        const unit=item.unit??(eggs?'caixa':quail?'pacote':'unidade');
        if(!(eggs?['caixa']:quail?['pacote']:['unidade','fardo']).includes(unit))throw new Error('Unidade inválida para '+product.name+'.');
        const count=item.quantity;
        if(count!==undefined&&(typeof count!=='number'||!Number.isFinite(count)||count<(eggs?0.5:1)||count>1000000||!Number.isInteger(count*(eggs?2:1))))throw new Error('Quantidade inválida para '+product.name+'.');
        let description='quantidade a combinar';
        if(count!==undefined){
          const plurals={caixa:'caixas',pacote:'pacotes',unidade:'unidades',fardo:'fardos'};
          description=eggs&&count===0.5?'meia caixa (6 cartelas, 180 ovos)':count.toLocaleString('pt-BR',{maximumFractionDigits:1})+' '+(count===1?unit:plurals[unit]);
        }
        return {product:item.product,name:product.name,quantity:count??null,unit,description};
      });
      const message='Olá! Vim pelo site da Mix Alimentos e gostaria de solicitar uma cotação para meu comércio.\n\nProdutos de interesse:\n'+items.map(item=>'- '+item.name+': '+item.description).join('\n')+'\n\nCidade: '+(city||'a informar')+'\n\nPodem me informar as condições e a disponibilidade de entrega?';
      return {items,city,message,whatsappUrl:'https://wa.me/'+whatsapp+'?text='+encodeURIComponent(message),requiresUserReview:true,orderConfirmed:false};
    }}
  ];
}

export function browserToolsSource(data) {
  return `(()=>{\nconst createTools=${createAgentTools.toString()};\nconst context=document.modelContext||navigator.modelContext;\nif(!context||typeof context.registerTool!=='function')return;\nfor(const tool of createTools(${JSON.stringify(data).replaceAll('<','\\u003c')})){\ntry{context.registerTool({...tool,execute:async input=>({content:[{type:'text',text:JSON.stringify(tool.execute(input))}]})});}catch(error){console.warn('Não foi possível registrar a ferramenta '+tool.name,error);}\n}\n})();\n`;
}
