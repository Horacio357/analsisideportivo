from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class League(Base):
    __tablename__ = "leagues"
    id = Column(String, primary_key=True, index=True) # e.g. 'AR', 'BR'
    name = Column(String)

class Team(Base):
    __tablename__ = "teams"
    id = Column(Integer, primary_key=True, index=True)
    league_id = Column(String, ForeignKey("leagues.id"))
    name = Column(String)
    logo = Column(String, nullable=True)
    color = Column(String)
    form = Column(String)
    goals = Column(Integer)
    conceded = Column(Integer)
    possession = Column(String)
    wins = Column(Integer)
    stats = Column(String) # Stored as comma-separated string e.g., "85,78,92,80,75,88"

    league = relationship("League")

class Match(Base):
    __tablename__ = "matches"
    id = Column(Integer, primary_key=True, index=True)
    league_id = Column(String, ForeignKey("leagues.id"))
    home_team_id = Column(Integer, ForeignKey("teams.id"))
    away_team_id = Column(Integer, ForeignKey("teams.id"))
    
    home_prob = Column(Integer)
    draw_prob = Column(Integer)
    away_prob = Column(Integer)
    prediction = Column(String)

    # New betting-focused fields (v2)
    group_name = Column(String, nullable=True) # e.g. "Grupo A"
    confidence = Column(String, nullable=True) # e.g. "ALTA", "MEDIA", "VALUE BET"
    
    # Seguro markets
    seguro_dnb_team = Column(String, nullable=True)
    seguro_dnb_odds = Column(String, nullable=True)
    seguro_handicap_market = Column(String, nullable=True)
    seguro_handicap_odds = Column(String, nullable=True)
    
    # Valor markets
    valor_1x2_team = Column(String, nullable=True)
    valor_1x2_odds = Column(String, nullable=True)
    valor_overunder_market = Column(String, nullable=True)
    valor_overunder_odds = Column(String, nullable=True)
    
    # Arriesgado markets
    arriesgado_1x2pt_market = Column(String, nullable=True)
    arriesgado_1x2pt_odds = Column(String, nullable=True)
    arriesgado_btts_market = Column(String, nullable=True)
    arriesgado_btts_odds = Column(String, nullable=True)
    
    # Context & Adjustments
    when_to_bet = Column(String, nullable=True) # e.g. "Pre-partido (24-48h antes)"
    pending_adjustments = Column(String, nullable=True) # e.g. "lesionados o convocatoria a confirmar"
    
    # Base Methodology Weights (60/25/10/5)
    metric_form_xg = Column(Integer, nullable=True) # 60%
    metric_squad = Column(Integer, nullable=True)   # 25%
    metric_context = Column(Integer, nullable=True) # 10%
    metric_h2h = Column(Integer, nullable=True)     # 5%

    league = relationship("League")
    home_team = relationship("Team", foreign_keys=[home_team_id])
    away_team = relationship("Team", foreign_keys=[away_team_id])

