"""Pluggable transit-source adapters.

Every source normalizes to Departure objects so the board firmware and the
CLI never care which agency the data came from. To add a source, subclass
TransitSource (or use GenericJsonSource with a JSON config file).
"""
from dataclasses import dataclass, field


@dataclass
class Departure:
    target: str          # destination code, e.g. "WTC"
    eta_text: str        # human text, e.g. "6 min"
    seconds: int = -1   # seconds to arrival, -1 if unknown
    color: str = "FFFFFF"  # line color as RRGGBB hex
    headsign: str = ""   # full destination name


class TransitSource:
    """A live departure feed for one transit agency."""

    name = "base"

    def departures(self, station: str, direction: str, n: int = 2) -> list[Departure]:
        """Next n departures from station toward direction."""
        raise NotImplementedError

    def stations(self) -> list[str]:
        """Known station codes (best effort)."""
        return []
