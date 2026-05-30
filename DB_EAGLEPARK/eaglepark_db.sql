--
-- PostgreSQL database dump
--

\restrict 1wRUaB6p3VHzhM8fsfFqnAdsUKygNrbr2Ns7vr0kibCUkeboAaauLlTMyIaKsgz

-- Dumped from database version 17.9
-- Dumped by pg_dump version 17.9

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: dashboard_data; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dashboard_data (
    id integer NOT NULL,
    total_eventos integer,
    total_reservas integer,
    total_estadisticas integer
);


ALTER TABLE public.dashboard_data OWNER TO postgres;

--
-- Name: dashboard_data_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.dashboard_data_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.dashboard_data_id_seq OWNER TO postgres;

--
-- Name: dashboard_data_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.dashboard_data_id_seq OWNED BY public.dashboard_data.id;


--
-- Name: destinos_turisticos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.destinos_turisticos (
    id integer NOT NULL,
    nombre text NOT NULL,
    descripcion_principal text,
    categoria text,
    telefono text,
    maps text,
    redes_sociales jsonb DEFAULT '[]'::jsonb,
    visibilidad text DEFAULT 'ACTIVO'::text,
    contenido_media jsonb DEFAULT '[]'::jsonb,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.destinos_turisticos OWNER TO postgres;

--
-- Name: destinos_turisticos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.destinos_turisticos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.destinos_turisticos_id_seq OWNER TO postgres;

--
-- Name: destinos_turisticos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.destinos_turisticos_id_seq OWNED BY public.destinos_turisticos.id;


--
-- Name: estacion_archivos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.estacion_archivos (
    id integer NOT NULL,
    estacion_id integer NOT NULL,
    tipo character varying(50) NOT NULL,
    archivo_nombre character varying(255) NOT NULL,
    archivo_url text NOT NULL,
    "archivo_tamaño" integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.estacion_archivos OWNER TO postgres;

--
-- Name: estacion_archivos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.estacion_archivos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.estacion_archivos_id_seq OWNER TO postgres;

--
-- Name: estacion_archivos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.estacion_archivos_id_seq OWNED BY public.estacion_archivos.id;


--
-- Name: estaciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.estaciones (
    id integer NOT NULL,
    orden integer NOT NULL,
    visibilidad character varying(50) DEFAULT 'Borrador'::character varying,
    descripcion_principal text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    media text[] DEFAULT '{}'::text[],
    nombre_estacion character varying(255)
);


ALTER TABLE public.estaciones OWNER TO postgres;

--
-- Name: estaciones_archivos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.estaciones_archivos (
    id integer NOT NULL,
    estacion_id integer NOT NULL,
    tipo character varying(50) NOT NULL,
    nombre_archivo character varying(255) NOT NULL,
    ruta_archivo character varying(500) NOT NULL,
    "tamaño" integer,
    fecha_cargado timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    activo boolean DEFAULT true
);


ALTER TABLE public.estaciones_archivos OWNER TO postgres;

--
-- Name: estaciones_archivos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.estaciones_archivos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.estaciones_archivos_id_seq OWNER TO postgres;

--
-- Name: estaciones_archivos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.estaciones_archivos_id_seq OWNED BY public.estaciones_archivos.id;


--
-- Name: estaciones_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.estaciones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.estaciones_id_seq OWNER TO postgres;

--
-- Name: estaciones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.estaciones_id_seq OWNED BY public.estaciones.id;


--
-- Name: estadisticas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.estadisticas (
    id integer NOT NULL,
    evento_id integer,
    asistentes integer,
    genero_distribucion json,
    edad_distribucion json
);


ALTER TABLE public.estadisticas OWNER TO postgres;

--
-- Name: estadisticas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.estadisticas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.estadisticas_id_seq OWNER TO postgres;

--
-- Name: estadisticas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.estadisticas_id_seq OWNED BY public.estadisticas.id;


--
-- Name: eventos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.eventos (
    id integer NOT NULL,
    titulo character varying(255) NOT NULL,
    descripcion text,
    fecha_inicio timestamp without time zone NOT NULL,
    fecha_fin timestamp without time zone NOT NULL,
    flyer_url character varying(255),
    hora_inicio time without time zone,
    hora_fin time without time zone,
    estado character varying(20) DEFAULT 'activo'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.eventos OWNER TO postgres;

--
-- Name: eventos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.eventos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.eventos_id_seq OWNER TO postgres;

--
-- Name: eventos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.eventos_id_seq OWNED BY public.eventos.id;


--
-- Name: reservas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reservas (
    id integer NOT NULL,
    evento_id integer,
    nombre character varying(255) NOT NULL,
    telefono character varying(255) NOT NULL,
    genero character varying(50),
    edad integer,
    nacionalidad character varying(255),
    fecha_visita date,
    estado character varying(50) DEFAULT 'pendiente'::character varying
);


ALTER TABLE public.reservas OWNER TO postgres;

--
-- Name: reservas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reservas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reservas_id_seq OWNER TO postgres;

--
-- Name: reservas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reservas_id_seq OWNED BY public.reservas.id;


--
-- Name: subestacion_archivos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subestacion_archivos (
    id integer NOT NULL,
    subestacion_id integer NOT NULL,
    tipo character varying(50) NOT NULL,
    archivo_nombre character varying(255) NOT NULL,
    archivo_url text NOT NULL,
    "archivo_tamaño" integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.subestacion_archivos OWNER TO postgres;

--
-- Name: subestacion_archivos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.subestacion_archivos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.subestacion_archivos_id_seq OWNER TO postgres;

--
-- Name: subestacion_archivos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.subestacion_archivos_id_seq OWNED BY public.subestacion_archivos.id;


--
-- Name: subestaciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subestaciones (
    id integer NOT NULL,
    estacion_id integer NOT NULL,
    nombre character varying(255) NOT NULL,
    orden integer DEFAULT 1,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    media text[],
    description text
);


ALTER TABLE public.subestaciones OWNER TO postgres;

--
-- Name: subestaciones_archivos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subestaciones_archivos (
    id integer NOT NULL,
    subestacion_id integer NOT NULL,
    tipo character varying(50) NOT NULL,
    nombre_archivo character varying(255) NOT NULL,
    ruta_archivo character varying(500) NOT NULL,
    "tamaño" integer,
    fecha_cargado timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    activo boolean DEFAULT true
);


ALTER TABLE public.subestaciones_archivos OWNER TO postgres;

--
-- Name: subestaciones_archivos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.subestaciones_archivos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.subestaciones_archivos_id_seq OWNER TO postgres;

--
-- Name: subestaciones_archivos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.subestaciones_archivos_id_seq OWNED BY public.subestaciones_archivos.id;


--
-- Name: subestaciones_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.subestaciones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.subestaciones_id_seq OWNER TO postgres;

--
-- Name: subestaciones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.subestaciones_id_seq OWNED BY public.subestaciones.id;


--
-- Name: dashboard_data id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dashboard_data ALTER COLUMN id SET DEFAULT nextval('public.dashboard_data_id_seq'::regclass);


--
-- Name: destinos_turisticos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.destinos_turisticos ALTER COLUMN id SET DEFAULT nextval('public.destinos_turisticos_id_seq'::regclass);


--
-- Name: estacion_archivos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estacion_archivos ALTER COLUMN id SET DEFAULT nextval('public.estacion_archivos_id_seq'::regclass);


--
-- Name: estaciones id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estaciones ALTER COLUMN id SET DEFAULT nextval('public.estaciones_id_seq'::regclass);


--
-- Name: estaciones_archivos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estaciones_archivos ALTER COLUMN id SET DEFAULT nextval('public.estaciones_archivos_id_seq'::regclass);


--
-- Name: estadisticas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estadisticas ALTER COLUMN id SET DEFAULT nextval('public.estadisticas_id_seq'::regclass);


--
-- Name: eventos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.eventos ALTER COLUMN id SET DEFAULT nextval('public.eventos_id_seq'::regclass);


--
-- Name: reservas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservas ALTER COLUMN id SET DEFAULT nextval('public.reservas_id_seq'::regclass);


--
-- Name: subestacion_archivos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subestacion_archivos ALTER COLUMN id SET DEFAULT nextval('public.subestacion_archivos_id_seq'::regclass);


--
-- Name: subestaciones id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subestaciones ALTER COLUMN id SET DEFAULT nextval('public.subestaciones_id_seq'::regclass);


--
-- Name: subestaciones_archivos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subestaciones_archivos ALTER COLUMN id SET DEFAULT nextval('public.subestaciones_archivos_id_seq'::regclass);


--
-- Data for Name: dashboard_data; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dashboard_data (id, total_eventos, total_reservas, total_estadisticas) FROM stdin;
\.


--
-- Data for Name: destinos_turisticos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.destinos_turisticos (id, nombre, descripcion_principal, categoria, telefono, maps, redes_sociales, visibilidad, contenido_media, updated_at, created_at) FROM stdin;
3	hotel quinta real	lugar de alojamiento	Alojamientos	45235353	https://maps.app.goo.gl/iwoexrecoyvNCXpUA	["https://maps.app.goo.gl/iwoexrecoyvNCXpUA"]	ACTIVO	["/uploads/turismo/1779854207399-40686429.jpg"]	2026-05-26 22:56:47.5302	2026-05-26 21:31:14.214253
1	la tolda sabor y tradicion	comidas tipicas	Restaurantes	46436464646	https://maps.app.goo.gl/3dbknA6Fdwhs9uv27	["https://maps.app.goo.gl/xg6fYUX1xYgdxeuN8"]	ACTIVO	["/uploads/turismo/1779854261653-580707589.jpg"]	2026-05-26 22:57:41.740883	2026-05-18 00:02:10.49697
2	piscina el mono	ven y disfruta	Piscinas	457456773	https://maps.app.goo.gl/h5ZUUZmfCwm5nBCZ9	["https://maps.app.goo.gl/xg6fYUX1xYgdxeuN8"]	ACTIVO	["/uploads/turismo/1779854411778-157596673.jpg"]	2026-05-26 23:00:52.965577	2026-05-18 21:21:53.655821
4	ensueño	ven a disfrutar una experiencia unica	Piscinas	2352334	https://share.google/ZBSn4M6vcxtRIFIax	["https://maps.app.goo.gl/iwoexrecoyvNCXpUA"]	ACTIVO	["/uploads/turismo/1779854121959-804447023.jpg"]	2026-05-26 23:03:31.799011	2026-05-26 21:32:05.835463
\.


--
-- Data for Name: estacion_archivos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.estacion_archivos (id, estacion_id, tipo, archivo_nombre, archivo_url, "archivo_tamaño", created_at) FROM stdin;
3	33	image	2024_02_12_18_49_IMG_3177.JPG	/uploads/estaciones/1779071469921-575549237.JPG	6081195	2026-05-17 21:31:10.143075
8	33	image	2024_02_16_08_10_IMG_2959.JPG	/uploads/estaciones/1779281209639-261301650.JPG	7785985	2026-05-20 07:46:49.761404
9	33	image	rcce-La-Tolda-Sabor-y-Tradicion-exterior.jpg	/uploads/estaciones/1779281209711-189862880.jpg	90175	2026-05-20 07:46:49.763266
10	34	image	200-IMG_4654.jpg	/uploads/estaciones/1779763238593-626832556.jpg	4420439	2026-05-25 21:40:38.654976
11	14	image	IMG_0155.JPG	/uploads/estaciones/1779766429164-121582904.JPG	13326192	2026-05-25 22:33:49.382715
12	14	image	1-IMG_4122.jpg	/uploads/estaciones/1779766429310-533235542.jpg	5779653	2026-05-25 22:33:49.383349
13	14	image	2-IMG_4188.jpg	/uploads/estaciones/1779766429332-107471651.jpg	5170099	2026-05-25 22:33:49.383693
14	14	image	3-IMG_4263.jpg	/uploads/estaciones/1779766429352-183456986.jpg	6142950	2026-05-25 22:33:49.38412
15	33	video	Download (49).mp4	/uploads/estaciones/1779769206804-352623038.mp4	6107877	2026-05-25 23:20:06.830712
16	15	image	Transform_this_static_202604202232.png	/uploads/estaciones/1779772567203-867831548.png	3534955	2026-05-26 00:16:07.247735
17	15	image	descarga (1).png	/uploads/estaciones/1779772567216-161232314.png	3314900	2026-05-26 00:16:07.248999
18	15	image	descarga.png	/uploads/estaciones/1779772567234-150688388.png	2491858	2026-05-26 00:16:07.249639
19	16	image	52-IMG_4224.jpg	/uploads/estaciones/1779772589951-536160293.jpg	8145535	2026-05-26 00:16:30.224575
20	16	image	2024_02_12_15_52_IMG_3292.JPG	/uploads/estaciones/1779772589982-496951916.JPG	8515026	2026-05-26 00:16:30.225184
21	16	image	2024_02_12_15_52_IMG_3293.JPG	/uploads/estaciones/1779772590017-486874049.JPG	10948521	2026-05-26 00:16:30.225628
22	16	image	2024_02_12_18_52_IMG_3175.JPG	/uploads/estaciones/1779772590061-219340471.JPG	5709622	2026-05-26 00:16:30.226157
23	16	image	2024_02_12_18_53_IMG_3170.JPG	/uploads/estaciones/1779772590087-986390080.JPG	5478895	2026-05-26 00:16:30.226539
24	16	image	2024_02_15_06_45_IMG_3036.JPG	/uploads/estaciones/1779772590111-24350495.JPG	11969361	2026-05-26 00:16:30.226984
25	16	image	2024_02_15_06_46_IMG_3034.JPG	/uploads/estaciones/1779772590162-265135136.JPG	11272748	2026-05-26 00:16:30.227441
26	16	image	IMG_2300.jpg	/uploads/estaciones/1779772590212-637064207.jpg	1489551	2026-05-26 00:16:30.227881
27	17	image	4-IMG_4160.jpg	/uploads/estaciones/1779772607331-290743669.jpg	6686913	2026-05-26 00:16:47.455577
28	17	image	5-IMG_4152.jpg	/uploads/estaciones/1779772607355-819768455.jpg	8978898	2026-05-26 00:16:47.456305
29	17	image	51-IMG_4247.jpg	/uploads/estaciones/1779772607390-644660502.jpg	6728765	2026-05-26 00:16:47.456734
30	17	image	484147573_653712447358358_2484432951958779672_n.jpg	/uploads/estaciones/1779772607431-263361242.jpg	485198	2026-05-26 00:16:47.457103
31	17	image	484404850_653712444025025_1531085152668384878_n.jpg	/uploads/estaciones/1779772607433-77334042.jpg	473262	2026-05-26 00:16:47.457453
32	17	image	IMG_3890.jpg	/uploads/estaciones/1779772607434-232588579.jpg	5246703	2026-05-26 00:16:47.457791
33	18	image	50-IMG_4291.jpg	/uploads/estaciones/1779772629439-570560900.jpg	6872330	2026-05-26 00:17:09.674449
34	18	image	2024_02_12_15_54_IMG_3288.JPG	/uploads/estaciones/1779772629466-665706279.JPG	7282567	2026-05-26 00:17:09.674845
35	18	image	2024_02_12_15_58_IMG_3281.JPG	/uploads/estaciones/1779772629496-229711295.JPG	8591269	2026-05-26 00:17:09.675186
36	18	image	2024_02_12_15_59_IMG_3280.JPG	/uploads/estaciones/1779772629532-706978457.JPG	7834994	2026-05-26 00:17:09.675542
37	18	image	2024_02_12_18_57_IMG_3158.JPG	/uploads/estaciones/1779772629562-94536255.JPG	6631349	2026-05-26 00:17:09.675902
38	18	image	2024_02_12_18_58_IMG_3154.JPG	/uploads/estaciones/1779772629585-872541005.JPG	5963922	2026-05-26 00:17:09.676324
39	18	image	2024_02_12_18_58_IMG_3156.JPG	/uploads/estaciones/1779772629609-980272322.JPG	5562722	2026-05-26 00:17:09.676751
40	18	image	2024_02_13_17_00_IMG_3057.JPG	/uploads/estaciones/1779772629631-481926724.JPG	10265626	2026-05-26 00:17:09.677179
41	19	image	2024_02_16_20_14_IMG_2941.JPG	/uploads/estaciones/1779853927247-19427518.JPG	5680400	2026-05-26 22:52:07.41124
42	19	image	2024_02_16_19_58_IMG_2946.JPG	/uploads/estaciones/1779853927269-452105675.JPG	6310601	2026-05-26 22:52:07.412168
43	19	image	2024_02_16_19_59_IMG_2944.JPG	/uploads/estaciones/1779853927296-307511357.JPG	5299789	2026-05-26 22:52:07.412675
44	19	image	2024_02_16_19_59_IMG_2945.JPG	/uploads/estaciones/1779853927320-410672465.JPG	6541966	2026-05-26 22:52:07.413067
45	19	image	2024_02_16_20_16_IMG_2937.JPG	/uploads/estaciones/1779853927350-308962632.JPG	6725699	2026-05-26 22:52:07.413425
46	19	image	2024_02_16_20_17_IMG_2936.JPG	/uploads/estaciones/1779853927377-77165629.JPG	6260593	2026-05-26 22:52:07.413825
47	20	image	IMG_2294.jpg	/uploads/estaciones/1779853998624-6031199.jpg	1037114	2026-05-26 22:53:18.730223
48	20	image	IMG_2296.jpg	/uploads/estaciones/1779853998640-974370351.jpg	1056621	2026-05-26 22:53:18.731816
49	20	image	IMG_2308.jpg	/uploads/estaciones/1779853998658-937602286.jpg	1268144	2026-05-26 22:53:18.732579
50	20	image	IMG_2321.jpg	/uploads/estaciones/1779853998679-475898914.jpg	1365622	2026-05-26 22:53:18.733216
51	20	image	IMG_2324.jpg	/uploads/estaciones/1779853998702-85580541.jpg	1674458	2026-05-26 22:53:18.733845
52	21	image	10-IMG_4212.jpg	/uploads/estaciones/1779854021804-226822059.jpg	7207410	2026-05-26 22:53:41.97453
53	21	image	12-IMG_4116.jpg	/uploads/estaciones/1779854021910-825518845.jpg	8997610	2026-05-26 22:53:41.97536
54	21	image	IMG_2314.jpg	/uploads/estaciones/1779854021959-191948157.jpg	1288653	2026-05-26 22:53:41.976474
55	21	image	IMG_2322.jpg	/uploads/estaciones/1779854021964-281113940.jpg	1076520	2026-05-26 22:53:41.977354
\.


--
-- Data for Name: estaciones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.estaciones (id, orden, visibilidad, descripcion_principal, created_at, updated_at, media, nombre_estacion) FROM stdin;
16	5	activo		2026-05-17 09:46:41.554705	2026-05-26 00:17:53.097445	{/uploads/estaciones/1779772589951-536160293.jpg,/uploads/estaciones/1779772589982-496951916.JPG,/uploads/estaciones/1779772590017-486874049.JPG,/uploads/estaciones/1779772590061-219340471.JPG,/uploads/estaciones/1779772590087-986390080.JPG,/uploads/estaciones/1779772590111-24350495.JPG,/uploads/estaciones/1779772590162-265135136.JPG,/uploads/estaciones/1779772590212-637064207.jpg}	El Amén.
15	4	activo		2026-05-17 09:46:41.554705	2026-05-26 00:16:07.245897	{/uploads/estaciones/1779772567203-867831548.png,/uploads/estaciones/1779772567216-161232314.png,/uploads/estaciones/1779772567234-150688388.png}	Lugar de la Sabiduría.
19	8	activo		2026-05-17 09:46:41.554705	2026-05-26 22:52:52.711001	{/uploads/estaciones/1779853927247-19427518.JPG,/uploads/estaciones/1779853927269-452105675.JPG,/uploads/estaciones/1779853927296-307511357.JPG,/uploads/estaciones/1779853927320-410672465.JPG,/uploads/estaciones/1779853927350-308962632.JPG,/uploads/estaciones/1779853927377-77165629.JPG}	Las Lámparas de los Lados.
22	11	Borrador	\N	2026-05-17 09:46:41.554705	2026-05-17 09:46:41.554705	{}	La Hora de Dios.
23	12	Borrador	\N	2026-05-17 09:46:41.554705	2026-05-17 09:46:41.554705	{}	La Vida de Jesús.
24	13	Borrador	\N	2026-05-17 09:46:41.554705	2026-05-17 09:46:41.554705	{}	Las Vasijas Vacías – El Monte de la Provisión.
25	14	Borrador	\N	2026-05-17 09:46:41.554705	2026-05-17 09:46:41.554705	{}	Fue por Amor a Ti.
26	15	Borrador	\N	2026-05-17 09:46:41.554705	2026-05-17 09:46:41.554705	{}	La Cruz.
27	16	Borrador	\N	2026-05-17 09:46:41.554705	2026-05-17 09:46:41.554705	{}	Las Huellas.
28	17	Borrador	\N	2026-05-17 09:46:41.554705	2026-05-17 09:46:41.554705	{}	El Jardín Getsemaní.
29	18	Borrador	\N	2026-05-17 09:46:41.554705	2026-05-17 09:46:41.554705	{}	El Nuevo Nacimiento.
30	19	Borrador	\N	2026-05-17 09:46:41.554705	2026-05-17 09:46:41.554705	{}	El Lugar de la Resurrección.
31	20	Borrador	\N	2026-05-17 09:46:41.554705	2026-05-17 09:46:41.554705	{}	Jesús Visita a los Discípulos.
32	21	Borrador	\N	2026-05-17 09:46:41.554705	2026-05-17 09:46:41.554705	{}	La Iglesia.
17	6	activo		2026-05-17 09:46:41.554705	2026-05-26 00:18:01.925118	{/uploads/estaciones/1779772607331-290743669.jpg,/uploads/estaciones/1779772607355-819768455.jpg,/uploads/estaciones/1779772607390-644660502.jpg,/uploads/estaciones/1779772607431-263361242.jpg,/uploads/estaciones/1779772607433-77334042.jpg,/uploads/estaciones/1779772607434-232588579.jpg}	La Oveja.
20	9	activo		2026-05-17 09:46:41.554705	2026-05-26 22:53:18.727556	{/uploads/estaciones/1779853998624-6031199.jpg,/uploads/estaciones/1779853998640-974370351.jpg,/uploads/estaciones/1779853998658-937602286.jpg,/uploads/estaciones/1779853998679-475898914.jpg,/uploads/estaciones/1779853998702-85580541.jpg}	El Arca.
21	10	activo		2026-05-17 09:46:41.554705	2026-05-26 22:53:41.97309	{/uploads/estaciones/1779854021804-226822059.jpg,/uploads/estaciones/1779854021910-825518845.jpg,/uploads/estaciones/1779854021959-191948157.jpg,/uploads/estaciones/1779854021964-281113940.jpg}	El Llavero de Dios.
18	7	activo		2026-05-17 09:46:41.554705	2026-05-26 00:18:17.993655	{/uploads/estaciones/1779772629439-570560900.jpg,/uploads/estaciones/1779772629466-665706279.JPG,/uploads/estaciones/1779772629496-229711295.JPG,/uploads/estaciones/1779772629532-706978457.JPG,/uploads/estaciones/1779772629562-94536255.JPG,/uploads/estaciones/1779772629585-872541005.JPG,/uploads/estaciones/1779772629609-980272322.JPG,/uploads/estaciones/1779772629631-481926724.JPG}	Los Atrios.
33	1	activo		2026-05-17 21:16:06.034203	2026-05-28 20:02:05.157329	{/uploads/estaciones/1779071469921-575549237.JPG,/uploads/estaciones/1779281209639-261301650.JPG,/uploads/estaciones/1779281209711-189862880.jpg,/uploads/estaciones/1779769206804-352623038.mp4}	La Puerta
34	2	activo		2026-05-25 21:37:42.122982	2026-05-25 21:40:38.653169	{/uploads/estaciones/1779763238593-626832556.jpg}	Salón Juan 3:16.
14	3	activo		2026-05-17 09:46:41.554705	2026-05-25 22:34:21.489679	{/uploads/estaciones/1779766429164-121582904.JPG,/uploads/estaciones/1779766429310-533235542.jpg,/uploads/estaciones/1779766429332-107471651.jpg,/uploads/estaciones/1779766429352-183456986.jpg}	La Gratitud.
\.


--
-- Data for Name: estaciones_archivos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.estaciones_archivos (id, estacion_id, tipo, nombre_archivo, ruta_archivo, "tamaño", fecha_cargado, activo) FROM stdin;
\.


--
-- Data for Name: estadisticas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.estadisticas (id, evento_id, asistentes, genero_distribucion, edad_distribucion) FROM stdin;
\.


--
-- Data for Name: eventos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.eventos (id, titulo, descripcion, fecha_inicio, fecha_fin, flyer_url, hora_inicio, hora_fin, estado, created_at) FROM stdin;
1	VIDEOssss	raws	2026-05-29 14:19:00	2026-05-30 02:19:00	uploads/flyer/1780028395458-483862743-evento.png	14:19:00	02:19:00	activo	2026-05-28 23:19:55.511273
\.


--
-- Data for Name: reservas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reservas (id, evento_id, nombre, telefono, genero, edad, nacionalidad, fecha_visita, estado) FROM stdin;
\.


--
-- Data for Name: subestacion_archivos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subestacion_archivos (id, subestacion_id, tipo, archivo_nombre, archivo_url, "archivo_tamaño", created_at) FROM stdin;
1	114	image	18-IMG_6764.jpg	/uploads/estaciones/1779763238621-160031663.jpg	1255909	2026-05-25 21:40:38.660627
2	115	image	15-IMG_6772.jpg	/uploads/estaciones/1779763238627-605971822.jpg	1470792	2026-05-25 21:40:38.662329
3	116	image	17-IMG_6765.jpg	/uploads/estaciones/1779763238633-938897999.jpg	1367852	2026-05-25 21:40:38.664021
4	117	image	11-IMG_6780.jpg	/uploads/estaciones/1779763238638-216120882.jpg	1980678	2026-05-25 21:40:38.665576
5	118	image	14-IMG_6775.jpg	/uploads/estaciones/1779763238646-475839585.jpg	1111454	2026-05-25 21:40:38.666964
\.


--
-- Data for Name: subestaciones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subestaciones (id, estacion_id, nombre, orden, created_at, updated_at, media, description) FROM stdin;
114	34	La Cruz entrada del Espíritu Santo a la Iglesia	1	2026-05-25 21:40:38.65956	2026-05-25 21:40:38.65956	{/uploads/estaciones/1779763238621-160031663.jpg}	
115	34	La Galeria	2	2026-05-25 21:40:38.661903	2026-05-25 21:40:38.661903	{/uploads/estaciones/1779763238627-605971822.jpg}	
116	34	El Pez — Te Haré Pescador de Hombres.	3	2026-05-25 21:40:38.66333	2026-05-25 21:40:38.66333	{/uploads/estaciones/1779763238633-938897999.jpg}	
117	34	EL Lugar de Descanso — La Silla de la Fe.	4	2026-05-25 21:40:38.665073	2026-05-25 21:40:38.665073	{/uploads/estaciones/1779763238638-216120882.jpg}	
118	34	La Vasija del Comienzo.	5	2026-05-25 21:40:38.666488	2026-05-25 21:40:38.666488	{/uploads/estaciones/1779763238646-475839585.jpg}	
\.


--
-- Data for Name: subestaciones_archivos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subestaciones_archivos (id, subestacion_id, tipo, nombre_archivo, ruta_archivo, "tamaño", fecha_cargado, activo) FROM stdin;
\.


--
-- Name: dashboard_data_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.dashboard_data_id_seq', 1, false);


--
-- Name: destinos_turisticos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.destinos_turisticos_id_seq', 4, true);


--
-- Name: estacion_archivos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.estacion_archivos_id_seq', 55, true);


--
-- Name: estaciones_archivos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.estaciones_archivos_id_seq', 1, false);


--
-- Name: estaciones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.estaciones_id_seq', 34, true);


--
-- Name: estadisticas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.estadisticas_id_seq', 1, false);


--
-- Name: eventos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.eventos_id_seq', 1, true);


--
-- Name: reservas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reservas_id_seq', 1, false);


--
-- Name: subestacion_archivos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.subestacion_archivos_id_seq', 6, true);


--
-- Name: subestaciones_archivos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.subestaciones_archivos_id_seq', 1, false);


--
-- Name: subestaciones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.subestaciones_id_seq', 120, true);


--
-- Name: dashboard_data dashboard_data_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dashboard_data
    ADD CONSTRAINT dashboard_data_pkey PRIMARY KEY (id);


--
-- Name: destinos_turisticos destinos_turisticos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.destinos_turisticos
    ADD CONSTRAINT destinos_turisticos_pkey PRIMARY KEY (id);


--
-- Name: estacion_archivos estacion_archivos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estacion_archivos
    ADD CONSTRAINT estacion_archivos_pkey PRIMARY KEY (id);


--
-- Name: estaciones_archivos estaciones_archivos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estaciones_archivos
    ADD CONSTRAINT estaciones_archivos_pkey PRIMARY KEY (id);


--
-- Name: estaciones estaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estaciones
    ADD CONSTRAINT estaciones_pkey PRIMARY KEY (id);


--
-- Name: estadisticas estadisticas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estadisticas
    ADD CONSTRAINT estadisticas_pkey PRIMARY KEY (id);


--
-- Name: eventos eventos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.eventos
    ADD CONSTRAINT eventos_pkey PRIMARY KEY (id);


--
-- Name: reservas reservas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservas
    ADD CONSTRAINT reservas_pkey PRIMARY KEY (id);


--
-- Name: subestacion_archivos subestacion_archivos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subestacion_archivos
    ADD CONSTRAINT subestacion_archivos_pkey PRIMARY KEY (id);


--
-- Name: subestaciones_archivos subestaciones_archivos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subestaciones_archivos
    ADD CONSTRAINT subestaciones_archivos_pkey PRIMARY KEY (id);


--
-- Name: subestaciones subestaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subestaciones
    ADD CONSTRAINT subestaciones_pkey PRIMARY KEY (id);


--
-- Name: idx_estacion_archivos_activo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_estacion_archivos_activo ON public.estaciones_archivos USING btree (activo);


--
-- Name: idx_estacion_archivos_estacion; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_estacion_archivos_estacion ON public.estaciones_archivos USING btree (estacion_id);


--
-- Name: idx_subestacion_archivos_activo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_subestacion_archivos_activo ON public.subestaciones_archivos USING btree (activo);


--
-- Name: idx_subestacion_archivos_subestacion; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_subestacion_archivos_subestacion ON public.subestaciones_archivos USING btree (subestacion_id);


--
-- Name: estacion_archivos estacion_archivos_estacion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estacion_archivos
    ADD CONSTRAINT estacion_archivos_estacion_id_fkey FOREIGN KEY (estacion_id) REFERENCES public.estaciones(id) ON DELETE CASCADE;


--
-- Name: estaciones_archivos estaciones_archivos_estacion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estaciones_archivos
    ADD CONSTRAINT estaciones_archivos_estacion_id_fkey FOREIGN KEY (estacion_id) REFERENCES public.estaciones(id) ON DELETE CASCADE;


--
-- Name: estadisticas estadisticas_evento_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estadisticas
    ADD CONSTRAINT estadisticas_evento_id_fkey FOREIGN KEY (evento_id) REFERENCES public.eventos(id);


--
-- Name: reservas reservas_evento_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservas
    ADD CONSTRAINT reservas_evento_id_fkey FOREIGN KEY (evento_id) REFERENCES public.eventos(id);


--
-- Name: subestacion_archivos subestacion_archivos_subestacion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subestacion_archivos
    ADD CONSTRAINT subestacion_archivos_subestacion_id_fkey FOREIGN KEY (subestacion_id) REFERENCES public.subestaciones(id) ON DELETE CASCADE;


--
-- Name: subestaciones_archivos subestaciones_archivos_subestacion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subestaciones_archivos
    ADD CONSTRAINT subestaciones_archivos_subestacion_id_fkey FOREIGN KEY (subestacion_id) REFERENCES public.subestaciones(id) ON DELETE CASCADE;


--
-- Name: subestaciones subestaciones_estacion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subestaciones
    ADD CONSTRAINT subestaciones_estacion_id_fkey FOREIGN KEY (estacion_id) REFERENCES public.estaciones(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict 1wRUaB6p3VHzhM8fsfFqnAdsUKygNrbr2Ns7vr0kibCUkeboAaauLlTMyIaKsgz

