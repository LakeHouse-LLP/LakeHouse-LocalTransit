"""Adapter registry. Sources are looked up by name; new ones are added here."""
from .base import Departure, TransitSource  # noqa: F401
from .path import PathSource  # noqa: F401
from .generic_json import GenericJsonSource  # noqa: F401
from .septa import SeptaSource  # noqa: F401
from .mbta import MbtaSource  # noqa: F401
from .bart import BartSource  # noqa: F401
from .tfl import TflSource  # noqa: F401
from .wienerlinien import WienerLinienSource  # noqa: F401

REGISTRY: dict[str, type[TransitSource]] = {
    PathSource.name: PathSource,
    GenericJsonSource.name: GenericJsonSource,
    SeptaSource.name: SeptaSource,
    MbtaSource.name: MbtaSource,
    BartSource.name: BartSource,
    TflSource.name: TflSource,
    WienerLinienSource.name: WienerLinienSource,
}


def get_source(name: str, **kwargs) -> TransitSource:
    try:
        cls = REGISTRY[name]
    except KeyError:
        raise ValueError(f"unknown source {name!r}; available: {sorted(REGISTRY)}")
    return cls(**kwargs)
