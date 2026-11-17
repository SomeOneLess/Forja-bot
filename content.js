'use strict';

const VERDADES = [
  '¿Cuál fue el lugar más raro donde tuviste sexo?',
  '¿A quién de este grupo le harías un oral sin pensarlo dos veces?',
  '¿Cuál es tu fantasía sexual que nunca le contaste a nadie?',
  '¿Alguna vez tuviste un crush fuerte con alguien de este grupo?',
  '¿Qué es lo más sucio que pensaste mientras estabas en una llamada con este grupo?',
  '¿Cuál es tu posición favorita y por qué?',
  '¿Alguna vez fingiste un orgasmo? ¿Con quién?',
  '¿Qué parte del cuerpo te parece más erótica en general?',
  '¿Cuál es el fetiche más raro que tenés?',
  '¿Preferís ser dominante o sumiso en la cama?',
  '¿Cuál es tu tipo de porno favorito?',
  '¿Alguna vez tuviste sexo en un lugar público?',
  '¿Qué es lo más vergonzoso que te pasó durante el sexo?',
  '¿A quién de este grupo le mandarías un nude ahora mismo?',
  '¿Cuál es la cosa más sucia que hiciste borracho/a?',
  '¿Qué te excita que te da vergüenza admitir?',
  '¿Alguna vez te masturbaste pensando en alguien de este grupo?',
  '¿Cuál fue tu experiencia sexual más intensa?',
  '¿Qué harías si estuvieras solo/a con la persona que más te atrae de este grupo?',
  '¿Cuál es tu mayor inseguridad sexual?',
  '¿Alguna vez tuviste un trío o te gustaría?',
  '¿Qué es lo más atrevido que mandaste por WhatsApp?',
  '¿Preferís dar o recibir oral?',
  '¿Cuál es el lugar más raro donde te masturbaste?',
  '¿Qué fantasía te gustaría cumplir con alguien de este grupo?'
];

const RETOS = [
  'Mandá un audio de 5 segundos gimiendo.',
  'Describí en detalle cómo sería tu noche ideal con alguien de este grupo.',
  'Hacé la cara que ponés cuando estás por correrte (y mandá foto o describila).',
  'Contá tu fantasía más sucia en máximo 3 oraciones.',
  'Mandá un mensaje de voz diciendo tu fetiche más raro.',
  'Describí cómo le harías un oral a alguien de este grupo.',
  'Mandá un sticker o emoji que represente cómo te ves cuando te venís.',
  'Contá la última vez que te masturbaste (con detalles).',
  'Hacé una imitación de cómo gemís.',
  'Decí en voz alta (o escribí) qué le harías a la persona que más te atrae del grupo.',
  'Mandá una foto de tu cara haciendo cara de placer.',
  'Describí tu tipo ideal en la cama con 3 palabras picantes.',
  'Contá un secreto sexual que nunca contaste.',
  'Mandá un audio diciendo "me quiero correr" con voz sexy.',
  'Describí cómo te gusta que te toquen.',
  'Hacé un ranking rápido de las 3 personas más follables del grupo.',
  'Mandá un mensaje como si estuvieras pidiendo sexo a alguien del grupo.',
  'Contá qué es lo primero que harías si estuvieras a solas con alguien de acá.',
  'Describí tu mejor orgasmo.',
  'Mandá un audio susurrando algo sucio.'
];

const DILEMAS = [
  '¿Preferís no poder mentir nunca más o no poder escuchar música nunca más?',
  '¿Preferís que tu pareja te engañe una vez o que vos la engañes una vez?',
  '¿Preferís sexo mediocre todos los días o sexo increíble una vez por mes?',
  '¿Preferís no poder tener orgasmos nunca más o no poder besar nunca más?',
  '¿Preferís que todo el grupo vea tus nudes o que vean tu historial de búsqueda?',
  '¿Preferís ser el que siempre da oral o el que siempre recibe?',
  '¿Preferís no poder masturbarte nunca más o no poder tener sexo con otra persona nunca más?',
  '¿Preferís que te graben teniendo sexo sin que lo sepas o que te graben y lo vean tus padres?',
  '¿Preferís un fetiche muy raro pero que te haga correrte fuerte o sexo vanilla aburrido?',
  '¿Preferís que alguien del grupo te haga un oral ahora o que te den 500 dólares?',
  '¿Preferís no poder tener erección/lubricación nunca más o no poder sentir nada en el cuerpo durante el sexo?',
  '¿Preferís que tu crush del grupo se entere de todo lo que pensás de él/ella o que nunca se entere?',
  '¿Preferís un trío con dos personas del grupo o una noche sola con la que más te gusta?',
  '¿Preferís que te digan cosas sucias durante el sexo o que te toquen de formas que no esperás?',
  '¿Preferís no poder decir "no" nunca más o no poder decir "sí" nunca más en el sexo?',
  '¿Preferís que todos sepan tu fetiche más raro o que nadie sepa que lo tenés?',
  '¿Preferís sexo con la luz prendida siempre o a oscuras siempre?',
  '¿Preferís que te dominen completamente o ser vos quien domina?',
  '¿Preferís no poder ver porno nunca más o no poder tener fantasías sexuales?',
  '¿Preferís que alguien del grupo te mande un nude ahora o que te diga en voz alta lo que piensa de tu cuerpo?'
];

const CATEGORIAS = [
  'marcas de cerveza', 'cosas que hay en una cocina', 'películas de terror',
  'posiciones sexuales', 'fetiches', 'lugares para tener sexo', 'nombres de pornstars',
  'cosas que te excitan', 'marcas de condones', 'juegos de cama',
  'cosas que decís durante el sexo', 'partes del cuerpo', 'bebidas alcohólicas',
  'series que viste borracho', 'apps de citas'
];

const RANKINGS = [
  'quien es más probable que se duerma en la llamada',
  'quien tiene el fetiche más raro',
  'quien es más probable que haya tenido sexo en un lugar público',
  'quien es más probable que se masturbe pensando en alguien del grupo',
  'quien es más probable que mande un nude por error',
  'quien es más probable que tenga un crush con alguien de acá',
  'quien es más probable que finja un orgasmo',
  'quien es más probable que sea el más sucio en la cama',
  'quien es más probable que haya tenido un trío',
  'quien es más probable que se excite con esta misma conversación'
];

const MIMICAS = [
  'actuá siendo un actor porno en su mejor escena',
  'imitá a alguien del grupo teniendo un orgasmo',
  'actuá cómo sería tu cara si te están haciendo un oral increíble',
  'imitá a alguien pidiendo sexo desesperadamente',
  'actuá una escena de dominación',
  'imitá cómo te ves cuando te venís',
  'actuá siendo un stripper',
  'imitá a alguien del grupo masturbándose',
  'actuá una fantasía sexual tuya',
  'imitá cómo gemís'
];

const CUENTOS_INICIO = [
  'Había una vez un grupo de amigos en una llamada que se puso más picante de lo esperado...',
  'Todo empezó cuando alguien del grupo mandó un mensaje que no debía...',
  'Eran las 3 de la mañana y la conversación se descontroló completamente...',
  'Nadie esperaba que esa noche de llamada terminara así...',
  'El grupo decidió jugar a algo que no tenía vuelta atrás...'
];

const RULETA_TAREAS = [
  'cantar algo sucio',
  'imitar a alguien del grupo',
  'contar un secreto sexual',
  'describir su última vez',
  'hacer una cara de orgasmo',
  'decir su fetiche',
  'proponer el próximo juego',
  'mandar un audio sexy',
  'contar una fantasía',
  'elegir a quién le haría algo sucio'
];

const PALABRAS_IMPOSTOR = [
  'Pizza', 'Mate', 'Asado', 'Fútbol', 'WhatsApp', 'Cerveza', 'Porno', 'Oral',
  'Orgasmo', 'Condón', 'Cama', 'Ducha', 'Auto', 'Oficina', 'Playa', 'Hotel'
];

const YONUNCA = [
  'Yo nunca me enamoré de alguien del grupo.',
  'Yo nunca mandé un mensaje a la persona equivocada.',
  'Yo nunca fingí un orgasmo.',
  'Yo nunca me masturbé pensando en alguien de este grupo.',
  'Yo nunca tuve sexo en un lugar público.',
  'Yo nunca me arrepentí de un mensaje que mandé borracho/a.',
  'Yo nunca tuve un crush con más de una persona del grupo al mismo tiempo.',
  'Yo nunca borré una conversación por vergüenza.',
  'Yo nunca mentí sobre con quién estaba.',
  'Yo nunca me excitó una conversación de este grupo.',
  'Yo nunca mandé un audio que después me dio vergüenza.',
  'Yo nunca fantaseé con alguien de acá.',
  'Yo nunca me quedé hasta las 5 AM en una llamada de este grupo.',
  'Yo nunca dije “estoy bien” cuando no lo estaba.',
  'Yo nunca me arrepentí de un like o una reacción.',
  'Yo nunca tuve un sueño erótico con alguien del grupo.',
  'Yo nunca me puse nervioso/a al hablar con alguien de acá.',
  'Yo nunca usé el “visto” a propósito.',
  'Yo nunca me reí de un chiste de este grupo que no entendí.',
  'Yo nunca pensé “qué ganas de…” mientras leía el chat.',
  'Yo nunca me acosté más tarde por culpa de este grupo.',
  'Yo nunca dije algo picante y después me arrepentí.',
  'Yo nunca me sentí celoso/a por una conversación del grupo.',
  'Yo nunca me imaginé una noche con alguien de acá.',
  'Yo nunca borré un mensaje antes de que lo lean.'
];

const RETOS_GRUPALES = [
  'Todos tienen que contar la última vez que se corrieron (con detalle o sin, ustedes eligen el nivel).',
  'Cada uno tiene que decir a quién del grupo le haría un oral sin pensarlo.',
  'El grupo tiene 2 minutos para armar el ranking de “más follable” del 1 al último.',
  'Todos mandan un audio de máximo 8 segundos gimiendo o imitando un gemido.',
  'Cada uno tiene que confesar su fetiche más raro (aunque sea en privado al bot).',
  'El grupo elige a 2 personas y ellas tienen que hacer un “ship” improvisado (describir cómo sería una cita o una noche).',
  'Todos tienen que decir qué posición sexual creen que le queda mejor a cada uno.',
  'Durante 5 minutos solo se puede hablar de forma extremadamente picante. El que se sale paga un reto.',
  'Cada uno nombra a la persona del grupo con la que más le gustaría quedar a solas y por qué.',
  'El grupo tiene que inventar entre todos una fantasía colectiva absurda o muy sucia.',
  'Todos mandan una foto de su cara haciendo “cara de placer” o la describen.',
  'Cada uno tiene que decir qué le haría a la persona que más le atrae del grupo en este momento.',
  'Se elige a alguien al azar y el resto tiene que decirle cosas sucias por 1 minuto.',
  'Todos tienen que confesar si alguna vez se excitaron con una conversación de este grupo.',
  'El grupo arma un ranking de “quién sería el mejor en la cama” y justifica cada puesto.'
];

const SHIP_FRASES = [
  'tienen una química que hasta el bot se dio cuenta',
  'serían la pareja más tóxica y adictiva del grupo',
  'en otra vida ya tuvieron 3 hijos y un divorcio épico',
  'el destino los está empujando y ellos hacen como que no ven',
  'serían perfectos para una noche y terribles para una relación',
  'tienen el potencial de incendiar el grupo si se juntan',
  'el algoritmo del bot los juntó por una razón',
  'serían esa pareja que todos envidian en secreto',
  'tienen vibes de “nos comemos y después ni nos hablamos”',
  'el universo ya firmó el contrato, solo falta que ustedes lo acepten'
];

const ESTADOS = [
  'deprimido nivel Venezuelan crisis',
  'al palo total, no baja más',
  'con un sueño que ni el café lo salva',
  'enojado con la vida y con el bot',
  'feliz como perro con dos colas',
  'excitado sin motivo aparente',
  'ansioso por cosas que ni existen',
  'en modo zen... mentira, estoy por explotar',
  'nostálgico de cuando el grupo era sano',
  'con ganas de hacer quilombo',
  'muerto por dentro pero respondo igual',
  'hiperactivo, no me paren',
  'en crisis existencial leve',
  'calentón selectivo',
  'con la moral por el piso',
  'eufórico sin razón válida',
  'resentido con alguien del grupo (no digo quién)',
  'en modo “no me jodan”',
  'romántico empedernido',
  'con cara de “me chupa un huevo”',
  'motivado por 3 minutos y después se me pasa',
  'triste pero productivamente triste',
  'en modo troll activado',
  'con el corazón roto y el wifi lento',
  'listo para el after aunque sean las 11 de la mañana'
];

const MAS_PROBABLE = [
  'se duerma en la próxima llamada',
  'mande un audio de más de 2 minutos',
  'tenga un crush con alguien de este grupo',
  'sea el más sucio en la cama',
  'finja un orgasmo',
  'mande un mensaje a la persona equivocada',
  'se excite con esta conversación',
  'termine borracho/a y diga de más',
  'borre un mensaje por vergüenza',
  'sea el primero en rajarse de un reto',
  'tenga el fetiche más raro',
  'se enamore de alguien del grupo',
  'mande un nude por error',
  'sea el más probable de terminar en un trío',
  'se quede hasta las 6 AM en la llamada'
];

module.exports = {
  VERDADES,
  RETOS,
  DILEMAS,
  CATEGORIAS,
  RANKINGS,
  MIMICAS,
  CUENTOS_INICIO,
  RULETA_TAREAS,
  PALABRAS_IMPOSTOR,
  YONUNCA,
  RETOS_GRUPALES,
  SHIP_FRASES,
  ESTADOS,
  MAS_PROBABLE
};