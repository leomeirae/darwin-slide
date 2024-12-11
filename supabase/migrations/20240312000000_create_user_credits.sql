-- Criar a tabela user_credits se ela não existir
CREATE TABLE IF NOT EXISTS user_credits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  credits INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id)
);

-- Habilitar RLS
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes para evitar conflitos
DROP POLICY IF EXISTS "Users can view their own credits" ON user_credits;
DROP POLICY IF EXISTS "Users can update their own credits" ON user_credits;
DROP POLICY IF EXISTS "Users can insert their own credits" ON user_credits;
DROP POLICY IF EXISTS "Service role can manage all credits" ON user_credits;

-- Criar novas políticas
CREATE POLICY "Users can view their own credits"
  ON user_credits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own credits"
  ON user_credits FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own credits"
  ON user_credits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can manage all credits"
  ON user_credits
  USING (auth.jwt()->>'role' = 'service_role');

-- Atualizar a função handle_new_user com search_path explícito
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Create profile if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = new.id) THEN
    INSERT INTO public.profiles (id)
    VALUES (new.id);
  END IF;
  
  -- Create initial credits if they don't exist
  IF NOT EXISTS (SELECT 1 FROM public.user_credits WHERE user_id = new.id) THEN
    INSERT INTO public.user_credits (user_id, credits)
    VALUES (new.id, 10);
  END IF;
  
  RETURN new;
END;
$$;

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS user_credits_user_id_idx ON user_credits(user_id);
CREATE INDEX IF NOT EXISTS user_credits_updated_at_idx ON user_credits(updated_at);

-- Conceder permissões necessárias
GRANT ALL ON user_credits TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE user_credits_id_seq TO authenticated; 