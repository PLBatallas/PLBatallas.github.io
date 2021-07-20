//Si se desea añadir, quitar o modificar una pregunta, respetar la estructura:
/*
{
   q:'Pregunta',
   options:['opcion0','opcion1','opcion2','opcion3'],
   answer: Indicar el número de la opción que es correcta
},
*/
const quiz =[
    {
        q:'Wich month comes before june ?',
        options:['may','september','july','august'],
        answer:0
    },
    {
       q:'Wich of this sentences uses first conditional ?',
        options:['If I study today I will go to the party tonight',
        'If it rained you would get wet',
        'If you had told me about the meeting I would have come'],
        answer:0
    },
    {
        q:'3 + 4 = 7 ?',
        options:['true','false'],
        answer:0
    },
    {
        q:'What time of day do we have breakfast?',
        options:['Afternoon','Evening','Morning'],
        answer:2
    },
    {
        q:'What is 22 + 6?',
        options:['99','28','44','12'],
        answer:1
    } //observe que la última pregunta no cierra con coma ,
    
]
