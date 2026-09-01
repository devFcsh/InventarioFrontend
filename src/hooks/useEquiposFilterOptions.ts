import { useEffect, useMemo, useState } from "react";
import { Marca, Modelo, Periferico, Serie, Usuario } from "../types";
import clienteAxios from ".";

type EquiposFilterOptionsParams = {
  perifericos: Periferico[];
  marcas: Marca[];
  modelos: Modelo[];
  series: Serie[];
  usuarios?: Usuario[];
  perifericoNombre: string;
  marcaNombre: string;
  modeloNombre: string;
  serieNombre: string;
  usuarioId?: string;
  estado?: "activo" | "bodega" | "baja";
};

type RelatedOptions = {
  perifericos: Periferico[];
  marcas: Marca[];
  modelos: Modelo[];
  series: Serie[];
  usuarios: Usuario[];
};

const opcionesVacias = (): RelatedOptions => ({
  perifericos: [],
  marcas: [],
  modelos: [],
  series: [],
  usuarios: [],
});

export const useEquiposFilterOptions = ({
  perifericos,
  marcas,
  modelos,
  series,
  perifericoNombre,
  marcaNombre,
  modeloNombre,
  serieNombre,
  usuarioId = "",
  estado,
}: EquiposFilterOptionsParams) => {
  const perifericoSeleccionado = useMemo(
    () => perifericos.find((option) => option?.nombre === perifericoNombre),
    [perifericos, perifericoNombre],
  );
  const marcaSeleccionada = useMemo(
    () => marcas.find((option) => option?.nombre === marcaNombre),
    [marcas, marcaNombre],
  );
  const modeloSeleccionado = useMemo(
    () => modelos.find((option) => option?.nombre === modeloNombre),
    [modelos, modeloNombre],
  );
  const serieSeleccionada = useMemo(
    () => series.find((option) => option?.nombre === serieNombre),
    [series, serieNombre],
  );

  const perifericoId = perifericoSeleccionado?.id_periferico || "";
  const marcaId = marcaSeleccionada?.id_marca || "";
  const modeloId = modeloSeleccionado?.id_modelo || "";
  const serieId = serieSeleccionada?.id_serie || "";

  const [relatedOptions, setRelatedOptions] = useState<RelatedOptions>(opcionesVacias);

  useEffect(() => {
    let cancelled = false;
    setRelatedOptions(opcionesVacias());

    const fetchRelatedOptions = async () => {
      try {
        const { data } = await clienteAxios.get("/equipos/opcionesFiltros", {
          params: {
            perifericoId: perifericoId || undefined,
            marcaId: marcaId || undefined,
            modeloId: modeloId || undefined,
            serieId: serieId || undefined,
            usuarioId: usuarioId || undefined,
            estado,
          },
        });

        if (!cancelled) {
          setRelatedOptions({
            perifericos: data.perifericos ?? [],
            marcas: data.marcas ?? [],
            modelos: data.modelos ?? [],
            series: data.series ?? [],
            usuarios: data.usuarios ?? [],
          });
        }
      } catch {
        if (!cancelled) setRelatedOptions(opcionesVacias());
      }
    };

    fetchRelatedOptions();

    return () => {
      cancelled = true;
    };
  }, [perifericoId, marcaId, modeloId, serieId, usuarioId, estado]);

  return {
    perifericosDisponibles: relatedOptions.perifericos,
    marcasDisponibles: relatedOptions.marcas,
    modelosDisponibles: relatedOptions.modelos,
    seriesDisponibles: relatedOptions.series,
    usuariosDisponibles: relatedOptions.usuarios,
  };
};
